const { SlashCommandBuilder } = require("discord.js");
const { ok, err, info, warn, reply, loadDb, saveDb, guildConfig, record, hasMod, normalizeTag } = require("../../utils/helpers");

module.exports = {
  data: new SlashCommandBuilder().setName("ses-sustur").setDescription("Üyenin mikrofonunu kapatır.").addUserOption(o=>o.setName("uye").setDescription("Üye").setRequired(true)),
  async execute(interaction) {
    if (!interaction.memberPermissions?.has("MuteMembers")) return reply(interaction,err("Yetki gerekli","Üyeleri Sustur yetkisi gerekir."));
    const m=interaction.options.getMember("üye"); await m.voice.setMute(true,"Moderasyon"); return reply(interaction,ok("Ses susturuldu",`${m.user.tag} mikrofonu kapatıldı.`));
  }
};
