const { SlashCommandBuilder } = require("discord.js");
const { ok, err, info, warn, reply, loadDb, saveDb, guildConfig, record, hasMod, normalizeTag } = require("../../utils/helpers");

module.exports = {
  data: new SlashCommandBuilder().setName("panel-kur").setDescription("Sunucu üye ve ses istatistik paneli oluşturur.").addChannelOption(o=>o.setName("kanal").setDescription("Panel kanalı").setRequired(true)),
  async execute(interaction) {
    if (!interaction.memberPermissions?.has("ManageChannels")) return reply(interaction,err("Yetki gerekli","Kanalları Yönet yetkisi gerekir."));
    const c=interaction.options.getChannel("kanal"); await c.send({embeds:[info("Sunucu İstatistik Paneli",`👥 Üyeler: **${interaction.guild.memberCount}**\n🎙️ Sesteki: **${interaction.guild.members.cache.filter(m=>m.voice.channel).size}**\n🧩 Kanallar: **${interaction.guild.channels.cache.size}**`)]});
    return reply(interaction,ok("Panel kuruldu",`${c} kanalına istatistik paneli gönderildi.`));
  }
};
