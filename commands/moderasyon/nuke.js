const { SlashCommandBuilder } = require("discord.js");
const { ok, err, info, warn, reply, loadDb, saveDb, guildConfig, record, hasMod, normalizeTag } = require("../../utils/helpers");

module.exports = {
  data: new SlashCommandBuilder().setName("nuke").setDescription("Kanalı aynı temel ayarlarla yeniden oluşturur."),
  async execute(interaction) {
    if (!interaction.memberPermissions?.has("ManageChannels")) return reply(interaction,err("Yetki gerekli","Kanalları Yönet yetkisi gerekir."));
    const old=interaction.channel, pos=old.rawPosition, parent=old.parentId, name=old.name, type=old.type; const newC=await old.clone({name,reason:"Nuke"}); await newC.setPosition(pos); if(parent) await newC.setParent(parent,{lockPermissions:true}); await old.delete("Nuke");
    return reply(interaction,ok("Kanal yenilendi",`${newC} kanalı yeniden oluşturuldu.`),true).catch(()=>{});
  }
};
