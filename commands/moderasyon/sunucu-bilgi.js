const { SlashCommandBuilder } = require("discord.js");
const { ok, err, info, warn, reply, loadDb, saveDb, guildConfig, record, hasMod, normalizeTag } = require("../../utils/helpers");

module.exports = {
  data: new SlashCommandBuilder().setName("sunucu-bilgi").setDescription("Sunucu detaylarını gösterir."),
  async execute(interaction) {
    const g=interaction.guild; return reply(interaction,info("Sunucu Bilgisi",g.name,[
      {name:"Üye",value:String(g.memberCount),inline:true},{name:"Kanal",value:String(g.channels.cache.size),inline:true},{name:"Rol",value:String(g.roles.cache.size),inline:true},
      {name:"Güvenlik seviyesi",value:String(g.verificationLevel),inline:true},{name:"Oluşturulma",value:`<t:${Math.floor(g.createdTimestamp/1000)}:F>`,inline:true},{name:"Sahip",value:`<@${g.ownerId}>`,inline:true}]));
  }
};
