const { SlashCommandBuilder } = require("discord.js");
const { ok, err, info, warn, reply, loadDb, saveDb, guildConfig, record, hasMod, normalizeTag } = require("../../utils/helpers");

module.exports = {
  data: new SlashCommandBuilder().setName("yavas-mod").setDescription("Kanal yavaş modunu ayarlar.").addIntegerOption(o=>o.setName("saniye").setDescription("0-21600 saniye").setRequired(true).setMinValue(0).setMaxValue(21600)),
  async execute(interaction) {
    if (!interaction.memberPermissions?.has("ManageChannels")) return reply(interaction,err("Yetki gerekli","Kanalları Yönet yetkisi gerekir."));
    const sec=interaction.options.getInteger("saniye"); await interaction.channel.setRateLimitPerUser(sec); return reply(interaction,ok("Yavaş mod ayarlandı",`Kanal yavaş modu: **${sec} saniye**.`));
  }
};
