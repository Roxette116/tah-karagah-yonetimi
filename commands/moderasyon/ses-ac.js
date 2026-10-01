const { SlashCommandBuilder } = require("discord.js");
const { ok, err, info, warn, reply, loadDb, saveDb, guildConfig, record, hasMod, normalizeTag } = require("../../utils/helpers");

module.exports = {
  data: new SlashCommandBuilder().setName("ses-ac").setDescription("Üyenin mikrofon susturmasını kaldırır.").addUserOption(o=>o.setName("uye").setDescription("Üye").setRequired(true)),
  async execute(interaction) {
    if (!interaction.memberPermissions?.has("MuteMembers")) return reply(interaction,err("Yetki gerekli","Üyeleri Sustur yetkisi gerekir."));
    const m=interaction.options.getMember("üye"); await m.voice.setMute(false,"Moderasyon"); return reply(interaction,ok("Ses açıldı",`${m.user.tag} mikrofonu açıldı.`));
  }
};
