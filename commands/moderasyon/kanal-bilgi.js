const { SlashCommandBuilder } = require("discord.js");
const { ok, err, info, warn, reply, loadDb, saveDb, guildConfig, record, hasMod, normalizeTag } = require("../../utils/helpers");

module.exports = {
  data: new SlashCommandBuilder().setName("kanal-bilgi").setDescription("Kanal detaylarını gösterir."),
  async execute(interaction) {
    const c=interaction.channel; return reply(interaction,info("Kanal Bilgisi",`${c}`,[
      {name:"ID",value:c.id,inline:true},{name:"Tür",value:String(c.type),inline:true},{name:"Pozisyon",value:String(c.rawPosition),inline:true},
      {name:"Kategori",value:c.parent?.name||"Yok",inline:true},{name:"Yavaş Mod",value:String(c.rateLimitPerUser||0)+" sn",inline:true}]));
  }
};
