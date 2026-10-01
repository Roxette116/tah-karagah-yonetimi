const { SlashCommandBuilder } = require("discord.js");
const { ok, err, info, warn, reply, loadDb, saveDb, guildConfig, record, hasMod, normalizeTag } = require("../../utils/helpers");

module.exports = {
  data: new SlashCommandBuilder().setName("ban").setDescription("Üyeyi sunucudan yasaklar.").addUserOption(o=>o.setName("uye").setDescription("Yasaklanacak üye").setRequired(true)).addStringOption(o=>o.setName("sebep").setDescription("Sebep")),
  async execute(interaction) {
    if (!hasMod(interaction)) return reply(interaction, err("Yetki gerekli", "Üyeleri Yasakla yetkisi gerekir."));
    const member=interaction.options.getMember("üye"), reason=interaction.options.getString("sebep")||"Sebep belirtilmedi.";
    if (!member || !member.bannable) return reply(interaction, err("İşlem yapılamadı", "Bu üyeyi yasaklayamıyorum."));
    await member.ban({reason}); record(interaction.guildId, member.id, "ban", reason); return reply(interaction, ok("Üye yasaklandı", `${member.user.tag} sunucudan yasaklandı.`, [{name:"Sebep",value:reason}]));
  }
};
