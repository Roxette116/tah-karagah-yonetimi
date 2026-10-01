const { SlashCommandBuilder } = require("discord.js");
const { ok, err, info, warn, reply, loadDb, saveDb, guildConfig, record, hasMod, normalizeTag } = require("../../utils/helpers");

module.exports = {
  data: new SlashCommandBuilder().setName("toplu-rol-ver").setDescription("Herkese veya botlara toplu rol verir.").addRoleOption(o=>o.setName("rol").setDescription("Verilecek rol").setRequired(true)).addStringOption(o=>o.setName("hedef").setDescription("all veya bots").setRequired(true).addChoices({name:"Herkes",value:"all"},{name:"Botlar",value:"bots"})),
  async execute(interaction) {
    if (!interaction.memberPermissions?.has("ManageRoles")) return reply(interaction,err("Yetki gerekli","Rolleri Yönet yetkisi gerekir."));
    const role=interaction.options.getRole("rol"), target=interaction.options.getString("hedef"); await interaction.guild.members.fetch();
    const members=interaction.guild.members.cache.filter(m=>target==="all"&&!m.user.bot || target==="bots"&&m.user.bot); let count=0;
    for(const m of members.values()){ if(m.manageable && role.editable){try{await m.roles.add(role);count++;}catch{}}}
    return reply(interaction,ok("Toplu rol işlemi",`${count} üyeye ${role} verildi.`));
  }
};
