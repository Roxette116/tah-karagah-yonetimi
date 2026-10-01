const { SlashCommandBuilder } = require("discord.js");
const { ok, err, info, warn, reply, loadDb, saveDb, guildConfig, record, hasMod, normalizeTag } = require("../../utils/helpers");

module.exports = {
  data: new SlashCommandBuilder().setName("kanal-gorunur").setDescription("Gizli kanalı tekrar görünür yapar."),
  async execute(interaction) {
    if (!interaction.memberPermissions?.has("ManageChannels")) return reply(interaction,err("Yetki gerekli","Kanalları Yönet yetkisi gerekir."));
    await interaction.channel.permissionOverwrites.edit(interaction.guild.roles.everyone,{ViewChannel:null}); return reply(interaction,ok("Kanal görünür","Kanal @everyone için tekrar görünür."));
  }
};
