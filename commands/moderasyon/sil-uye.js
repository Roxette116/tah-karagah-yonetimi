const { SlashCommandBuilder } = require("discord.js");
const { ok, err, info, warn, reply, loadDb, saveDb, guildConfig, record, hasMod, normalizeTag } = require("../../utils/helpers");

module.exports = {
  data: new SlashCommandBuilder().setName("sil-uye").setDescription("Belirli bir üyenin son mesajlarını temizler.").addUserOption(o=>o.setName("uye").setDescription("Üye").setRequired(true)).addIntegerOption(o=>o.setName("miktar").setDescription("1-100").setRequired(true).setMinValue(1).setMaxValue(100)),
  async execute(interaction) {
    if (!interaction.memberPermissions?.has("ManageMessages")) return reply(interaction,err("Yetki gerekli","Mesajları Yönet yetkisi gerekir."));
    const member=interaction.options.getMember("üye"), n=interaction.options.getInteger("miktar"); const msgs=await interaction.channel.messages.fetch({limit:100});
    const mine=msgs.filter(m=>m.author.id===member.id).first(n); let count=0; if(mine.length) count=(await interaction.channel.bulkDelete(mine,true)).size;
    return reply(interaction,ok("Üye mesajları silindi",`${member.user.tag} kullanıcısının **${count}** mesajı silindi.`));
  }
};
