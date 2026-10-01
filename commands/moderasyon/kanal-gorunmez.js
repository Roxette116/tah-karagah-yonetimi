const { SlashCommandBuilder } = require("discord.js");
const { ok, err, info, warn, reply, loadDb, saveDb, guildConfig, record, hasMod, normalizeTag } = require("../../utils/helpers");

module.exports = {
  data: new SlashCommandBuilder().setName("kanal-gorunmez").setDescription("Kanalı @everyone için gizler."),
  async execute(interaction) {
    if (!interaction.memberPermissions?.has("ManageChannels")) return reply(interaction,err("Yetki gerekli","Kanalları Yönet yetkisi gerekir."));
    await interaction.channel.permissionOverwrites.edit(interaction.guild.roles.everyone,{ViewChannel:false}); return reply(interaction,ok("Kanal gizlendi","Kanal @everyone için görünmez oldu."));
  }
};
