const { SlashCommandBuilder } = require("discord.js");
const { ok, err, info, warn, reply, loadDb, saveDb, guildConfig, record, hasMod, normalizeTag } = require("../../utils/helpers");

module.exports = {
  data: new SlashCommandBuilder().setName("toplu-rol-al").setDescription("Herkesten belirlenen rolü alır.").addRoleOption(o=>o.setName("rol").setDescription("Alınacak rol").setRequired(true)),
  async execute(interaction) {
    if (!interaction.memberPermissions?.has("ManageRoles")) return reply(interaction,err("Yetki gerekli","Rolleri Yönet yetkisi gerekir."));
    const role=interaction.options.getRole("rol"); await interaction.guild.members.fetch(); let count=0;
    for(const m of interaction.guild.members.cache.values()){ if(m.roles.cache.has(role.id)&&m.manageable&&role.editable){try{await m.roles.remove(role);count++;}catch{}}}
    return reply(interaction,ok("Toplu rol alma",`${count} üyeden ${role} alındı.`));
  }
};
