const { SlashCommandBuilder } = require("discord.js");
const { ok, err, info, warn, reply, loadDb, saveDb, guildConfig, record, hasMod, normalizeTag } = require("../../utils/helpers");

module.exports = {
  data: new SlashCommandBuilder().setName("ses-at").setDescription("Üyeyi ses kanalından çıkarır.").addUserOption(o=>o.setName("uye").setDescription("Üye").setRequired(true)),
  async execute(interaction) {
    if (!interaction.memberPermissions?.has("MoveMembers")) return reply(interaction,err("Yetki gerekli","Üyeleri Taşı yetkisi gerekir."));
    const m=interaction.options.getMember("üye"); if(!m.voice.channel) return reply(interaction,warn("Ses kanalı yok","Üye ses kanalında değil.")); await m.voice.disconnect("Moderasyon"); return reply(interaction,ok("Ses kanalından çıkarıldı",`${m.user.tag} çıkarıldı.`));
  }
};
