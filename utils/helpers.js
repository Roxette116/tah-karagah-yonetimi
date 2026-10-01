const fs = require("node:fs");
const path = require("node:path");
const { EmbedBuilder, PermissionFlagsBits } = require("discord.js");
const config = require("../config.json");

const COLORS = config.colors;

function embed(type, title, description = "", fields = []) {
  const color = COLORS[type] || config.defaultColor;
  const e = new EmbedBuilder()
    .setColor(color)
    .setTitle(title)
    .setDescription(description || null)
    .setTimestamp()
    .setFooter({ text: config.footer });
  if (fields.length) e.addFields(fields);
  return e;
}

const ok = (title, description, fields) => embed("success", `✅ ${title}`, description, fields);
const err = (title, description, fields) => embed("error", `❌ ${title}`, description, fields);
const info = (title, description, fields) => embed("info", `ℹ️ ${title}`, description, fields);
const warn = (title, description, fields) => embed("warning", `⚠️ ${title}`, description, fields);

function reply(interaction, e, ephemeral = true) {
  return interaction.reply({ embeds: [e], ephemeral });
}

function getDbPath() { return path.resolve(config.databaseFile); }

function defaultDb() {
  return {
    guilds: {},
    warnings: {},
    history: {},
    blacklist: {},
    autoresponses: {},
    levels: {},
    backups: {},
    tickets: {}
  };
}

function loadDb() {
  const p = getDbPath();
  fs.mkdirSync(path.dirname(p), { recursive: true });
  if (!fs.existsSync(p)) fs.writeFileSync(p, JSON.stringify(defaultDb(), null, 2));
  try { return JSON.parse(fs.readFileSync(p, "utf8")); }
  catch { return defaultDb(); }
}

function saveDb(db) {
  fs.mkdirSync(path.dirname(getDbPath()), { recursive: true });
  fs.writeFileSync(getDbPath(), JSON.stringify(db, null, 2));
}

function guildConfig(guildId) {
  const db = loadDb();
  db.guilds[guildId] ||= {};
  return { db, cfg: db.guilds[guildId] };
}

function record(guildId, userId, action, reason = "") {
  const db = loadDb();
  db.history[guildId] ||= {};
  db.history[guildId][userId] ||= [];
  db.history[guildId][userId].push({ action, reason, at: Date.now() });
  saveDb(db);
}

function hasMod(interaction) {
  return interaction.memberPermissions?.has(PermissionFlagsBits.ModerateMembers) ||
         interaction.memberPermissions?.has(PermissionFlagsBits.ManageGuild);
}

function isHttpUrl(s) {
  try { const u = new URL(s); return ["http:", "https:"].includes(u.protocol); }
  catch { return false; }
}

function normalizeTag(tag) {
  return String(tag || "").replace(/[^\p{L}\p{N} ._\-]/gu, "").slice(0, 10);
}

module.exports = { COLORS, embed, ok, err, info, warn, reply, loadDb, saveDb, guildConfig, record, hasMod, isHttpUrl, normalizeTag };
