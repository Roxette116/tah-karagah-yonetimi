const { SlashCommandBuilder } = require("discord.js");
const { ok, err, info, warn, reply, loadDb, saveDb, guildConfig, record, hasMod, normalizeTag } = require("../../utils/helpers");

module.exports = {
  data: new SlashCommandBuilder().setName("rol-bilgi").setDescription("Rol detaylarını gösterir.").addRoleOption(o=>o.setName("rol").setDescription("Rol").setRequired(true)),
  async execute(interaction) {
    const r=interaction.options.getRole("rol"); return reply(interaction,info("Rol Bilgisi",`${r}`,[
      {name:"ID",value:r.id,inline:true},{name:"Üye",value:String(r.members.size),inline:true},{name:"Pozisyon",value:String(r.position),inline:true},
      {name:"Yönetilebilir",value:r.editable?"Evet":"Hayır",inline:true},{name:"Yetkiler",value:r.permissions.toArray().slice(0,20).join(", ")||"Yok"}]));
  }
};
