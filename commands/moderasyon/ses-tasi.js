const { SlashCommandBuilder } = require("discord.js");
const { ok, err, info, warn, reply, loadDb, saveDb, guildConfig, record, hasMod, normalizeTag } = require("../../utils/helpers");

module.exports = {
  data: new SlashCommandBuilder().setName("ses-tasi").setDescription("Üyeyi başka ses kanalına taşır.").addUserOption(o=>o.setName("uye").setDescription("Üye").setRequired(true)).addChannelOption(o=>o.setName("kanal").setDescription("Ses kanalı").setRequired(true)),
  async execute(interaction) {
    if (!interaction.memberPermissions?.has("MoveMembers")) return reply(interaction,err("Yetki gerekli","Üyeleri Taşı yetkisi gerekir."));
    const m=interaction.options.getMember("üye"), c=interaction.options.getChannel("kanal"); if(!c.isVoiceBased()) return reply(interaction,err("Geçersiz kanal","Bir ses kanalı seç."));
    await m.voice.setChannel(c); return reply(interaction,ok("Üye taşındı",`${m.user.tag} → ${c}`));
  }
};
