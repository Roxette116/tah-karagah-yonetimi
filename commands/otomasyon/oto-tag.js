const { SlashCommandBuilder } = require("discord.js");
const { ok, err, info, warn, reply, loadDb, saveDb, guildConfig, record, hasMod, normalizeTag } = require("../../utils/helpers");

module.exports = {
  data: new SlashCommandBuilder().setName("oto-tag").setDescription("Yeni üyelere otomatik isim etiketi ayarlar.").addStringOption(o => o.setName("tag").setDescription("İsim ön eki").setRequired(true)).addBooleanOption(o => o.setName("aktif").setDescription("Sistemi aktif et")),
  async execute(interaction) {
    if (!hasMod(interaction)) return reply(interaction, err("Yetki gerekli", "Yönet yetkisi gerekir."));
    const tag = normalizeTag(interaction.options.getString("tag")); const active = interaction.options.getBoolean("aktif") ?? true;
    const {db,cfg}=guildConfig(interaction.guildId); cfg.autoTag={tag,active}; saveDb(db);
    return reply(interaction, ok("Oto-tag ayarlandı", `Etiket: **${tag}** • Durum: **${active?"Aktif":"Pasif"}**`));
  }
};
