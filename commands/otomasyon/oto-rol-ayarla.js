const { SlashCommandBuilder } = require("discord.js");
const { ok, err, info, warn, reply, loadDb, saveDb, guildConfig, record, hasMod, normalizeTag } = require("../../utils/helpers");

module.exports = {
  data: new SlashCommandBuilder().setName("oto-rol-ayarla").setDescription("Yeni üyelere otomatik verilecek rolü ayarlar.").addRoleOption(o => o.setName("rol").setDescription("Otomatik verilecek rol").setRequired(true)),
  async execute(interaction) {
    if (!hasMod(interaction)) return reply(interaction, err("Yetki gerekli", "Bu komut için Yönet veya Üyeleri Yönet yetkisi gerekir."));
    const role = interaction.options.getRole("rol");
    const { db, cfg } = guildConfig(interaction.guildId);
    cfg.autoRole = role.id; saveDb(db);
    return reply(interaction, ok("Oto-rol ayarlandı", `${role} yeni katılan üyelere otomatik verilecek.`));
  }
};
