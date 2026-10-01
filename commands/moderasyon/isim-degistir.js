const { SlashCommandBuilder } = require("discord.js");
const { ok, err, info, warn, reply, loadDb, saveDb, guildConfig, record, hasMod, normalizeTag } = require("../../utils/helpers");

module.exports = {
  data: new SlashCommandBuilder().setName("isim-degistir").setDescription("Üyenin sunucu içi takma adını değiştirir.").addUserOption(o=>o.setName("uye").setDescription("Üye").setRequired(true)).addStringOption(o=>o.setName("isim").setDescription("Yeni isim").setRequired(true)),
  async execute(interaction) {
    if (!interaction.memberPermissions?.has("ManageNicknames")) return reply(interaction,err("Yetki gerekli","Takma Adları Yönet yetkisi gerekir."));
    const m=interaction.options.getMember("üye"), name=interaction.options.getString("isim"); await m.setNickname(name); return reply(interaction,ok("İsim değiştirildi",`${m} yeni adıyla **${name}** oldu.`));
  }
};
