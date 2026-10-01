const { SlashCommandBuilder } = require("discord.js");
const { ok, err, info, warn, reply, loadDb, saveDb, guildConfig, record, hasMod, normalizeTag } = require("../../utils/helpers");

module.exports = {
  data: new SlashCommandBuilder().setName("sil-bot").setDescription("Kanaldaki bot mesajlarını temizler.").addIntegerOption(o=>o.setName("miktar").setDescription("Kontrol edilecek mesaj sayısı").setRequired(true).setMinValue(1).setMaxValue(100)),
  async execute(interaction) {
    if (!interaction.memberPermissions?.has("ManageMessages")) return reply(interaction,err("Yetki gerekli","Mesajları Yönet yetkisi gerekir."));
    const n=interaction.options.getInteger("miktar"); const msgs=await interaction.channel.messages.fetch({limit:n}); const bots=msgs.filter(m=>m.author.bot);
    const count=bots.size? (await interaction.channel.bulkDelete(bots,true)).size:0; return reply(interaction,ok("Bot mesajları silindi",`${count} bot mesajı temizlendi.`));
  }
};
