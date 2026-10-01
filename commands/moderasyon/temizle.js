const { SlashCommandBuilder } = require("discord.js");
const { ok, err, info, warn, reply, loadDb, saveDb, guildConfig, record, hasMod, normalizeTag } = require("../../utils/helpers");

module.exports = {
  data: new SlashCommandBuilder().setName("temizle").setDescription("1-100 arası mesajı topluca siler.").addIntegerOption(o=>o.setName("miktar").setDescription("1-100").setRequired(true).setMinValue(1).setMaxValue(100)),
  async execute(interaction) {
    if (!interaction.memberPermissions?.has("ManageMessages")) return reply(interaction,err("Yetki gerekli","Mesajları Yönet yetkisi gerekir."));
    const n=interaction.options.getInteger("miktar"); const deleted=await interaction.channel.bulkDelete(n,true); return reply(interaction,ok("Mesajlar silindi",`${deleted.size} mesaj temizlendi.`));
  }
};
