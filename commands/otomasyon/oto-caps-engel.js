const { SlashCommandBuilder } = require("discord.js");
const { ok, err, info, warn, reply, loadDb, saveDb, guildConfig, record, hasMod, normalizeTag } = require("../../utils/helpers");

module.exports = {
  data: new SlashCommandBuilder().setName("oto-caps-engel").setDescription("Aşırı büyük harf filtresini ayarlar.").addBooleanOption(o => o.setName("aktif").setDescription("Sistemi aktif et")),
  async execute(interaction) {
    if (!hasMod(interaction)) return reply(interaction, err("Yetki gerekli", "Yönet yetkisi gerekir."));
    const active=interaction.options.getBoolean("aktif") ?? true; const {db,cfg}=guildConfig(interaction.guildId); cfg.capsBlock=active; saveDb(db);
    return reply(interaction, ok("Caps engel", `Durum: **${active?"Aktif":"Pasif"}**`));
  }
};
