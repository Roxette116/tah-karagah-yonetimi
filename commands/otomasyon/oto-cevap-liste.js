const { SlashCommandBuilder } = require("discord.js");
const { ok, err, info, warn, reply, loadDb, saveDb, guildConfig, record, hasMod, normalizeTag } = require("../../utils/helpers");

module.exports = {
  data: new SlashCommandBuilder().setName("oto-cevap-liste").setDescription("Otomatik cevapları listeler."),
  async execute(interaction) {
    const db = loadDb(); const data = db.autoresponses[interaction.guildId] || {};
    const lines = Object.entries(data).map(([k,v]) => `• **${k}** → ${v}`);
    return reply(interaction, info("Otomatik cevaplar", lines.length ? lines.join("\n").slice(0,3900) : "Kayıtlı otomatik cevap yok."));
  }
};
