const { SlashCommandBuilder } = require("discord.js");
const { ok, err, info, warn, reply, loadDb, saveDb, guildConfig, record, hasMod, normalizeTag } = require("../../utils/helpers");

module.exports = {
  data: new SlashCommandBuilder().setName("sunucu-kurulum").setDescription("Hazır moderasyon kanallarını oluşturur."),
  async execute(interaction) {
    if (!interaction.memberPermissions?.has("ManageGuild")) return reply(interaction,err("Yetki gerekli","Sunucuyu Yönet yetkisi gerekir."));
    const names=["mod-log","hosgeldin","veda","destek"]; let created=0;
    for(const name of names){ if(!interaction.guild.channels.cache.find(c=>c.name===name)){await interaction.guild.channels.create({name,type:0});created++;} }
    return reply(interaction,ok("Kurulum tamamlandı",`${created} yeni kanal oluşturuldu.`));
  }
};
