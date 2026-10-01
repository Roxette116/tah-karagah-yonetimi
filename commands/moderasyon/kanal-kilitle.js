const { SlashCommandBuilder } = require("discord.js");
const { ok, err, info, warn, reply, loadDb, saveDb, guildConfig, record, hasMod, normalizeTag } = require("../../utils/helpers");

module.exports = {
  data: new SlashCommandBuilder().setName("kanal-kilitle").setDescription("Kanalı üyelerin mesaj yazmasına kapatır."),
  async execute(interaction) {
    if (!interaction.memberPermissions?.has("ManageChannels")) return reply(interaction,err("Yetki gerekli","Kanalları Yönet yetkisi gerekir."));
    await interaction.channel.permissionOverwrites.edit(interaction.guild.roles.everyone,{SendMessages:false}); return reply(interaction,ok("Kanal kilitlendi","@everyone artık bu kanala mesaj gönderemez."));
  }
};
