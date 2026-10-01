const { SlashCommandBuilder } = require("discord.js");
const { ok, err, info, warn, reply, loadDb, saveDb, guildConfig, record, hasMod, normalizeTag } = require("../../utils/helpers");

module.exports = {
  data: new SlashCommandBuilder().setName("oto-guvenlik").setDescription("Yeni hesapları karantinaya alma ayarını yapar.").addIntegerOption(o=>o.setName("gun").setDescription("Minimum hesap yaşı (gün)").setRequired(true).setMinValue(0).setMaxValue(365)).addRoleOption(o=>o.setName("rol").setDescription("Karantina rolü").setRequired(true)),
  async execute(interaction) {
    if (!hasMod(interaction)) return reply(interaction, err("Yetki gerekli", "Yönet yetkisi gerekir."));
    const days=interaction.options.getInteger("gun"), role=interaction.options.getRole("rol"); const {db,cfg}=guildConfig(interaction.guildId);
    cfg.security={days,role:role.id}; saveDb(db); return reply(interaction, ok("Güvenlik ayarı", `**${days} gün** altındaki hesaplar ${role} rolüne alınacak.`));
  }
};
