const { SlashCommandBuilder } = require("discord.js");
const { ok, err, info, warn, reply, loadDb, saveDb, guildConfig, record, hasMod, normalizeTag } = require("../../utils/helpers");

module.exports = {
  data: new SlashCommandBuilder().setName("ses-sagirlastir").setDescription("Üyenin duymasını engeller.").addUserOption(o=>o.setName("uye").setDescription("Üye").setRequired(true)),
  async execute(interaction) {
    if (!interaction.memberPermissions?.has("DeafenMembers")) return reply(interaction,err("Yetki gerekli","Üyeleri Sağırlaştır yetkisi gerekir."));
    const m=interaction.options.getMember("üye"); await m.voice.setDeaf(true,"Moderasyon"); return reply(interaction,ok("Üye sağırlaştırıldı",`${m.user.tag} sesleri duyamıyor.`));
  }
};
