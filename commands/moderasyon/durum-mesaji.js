const { SlashCommandBuilder } = require("discord.js");
const { ok, err, info, warn, reply, loadDb, saveDb, guildConfig, record, hasMod, normalizeTag } = require("../../utils/helpers");

module.exports = {
  data: new SlashCommandBuilder().setName("durum-mesaji").setDescription("Botun Discord durum mesajını değiştirir.").addStringOption(o=>o.setName("mesaj").setDescription("Durum metni").setRequired(true)).addStringOption(o=>o.setName("tip").setDescription("playing/watching/listening/streaming").addChoices({name:"Oynuyor",value:"playing"},{name:"İzliyor",value:"watching"},{name:"Dinliyor",value:"listening"},{name:"Yayınlıyor",value:"streaming"})),
  async execute(interaction) {
    if (!interaction.memberPermissions?.has("ManageGuild")) return reply(interaction,err("Yetki gerekli","Sunucuyu Yönet yetkisi gerekir."));
    const text=interaction.options.getString("mesaj"), type=interaction.options.getString("tip")||"playing"; const map={playing:0,streaming:1,listening:2,watching:3};
    await interaction.client.user.setPresence({activities:[{name:text,type:map[type]}],status:"online"}); return reply(interaction,ok("Durum güncellendi",`**${text}** • ${type}`));
  }
};
