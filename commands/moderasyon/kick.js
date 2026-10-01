const { SlashCommandBuilder } = require("discord.js");
const { ok, err, info, warn, reply, loadDb, saveDb, guildConfig, record, hasMod, normalizeTag } = require("../../utils/helpers");

module.exports = {
  data: new SlashCommandBuilder().setName("kick").setDescription("Üyeyi sunucudan atar.").addUserOption(o=>o.setName("uye").setDescription("Atılacak üye").setRequired(true)).addStringOption(o=>o.setName("sebep").setDescription("Sebep")),
  async execute(interaction) {
    if (!hasMod(interaction)) return reply(interaction, err("Yetki gerekli", "Üyeleri At yetkisi gerekir."));
    const member=interaction.options.getMember("üye"), reason=interaction.options.getString("sebep")||"Sebep belirtilmedi.";
    if (!member || !member.kickable) return reply(interaction,err("İşlem yapılamadı","Bu üyeyi atamıyorum."));
    await member.kick(reason); record(interaction.guildId,member.id,"kick",reason); return reply(interaction,ok("Üye atıldı",`${member.user.tag} sunucudan atıldı.`,[{name:"Sebep",value:reason}]));
  }
};
