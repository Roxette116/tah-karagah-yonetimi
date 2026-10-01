const { SlashCommandBuilder } = require("discord.js");
const { ok, err, info, warn, reply, loadDb, saveDb, guildConfig, record, hasMod, normalizeTag } = require("../../utils/helpers");

module.exports = {
  data: new SlashCommandBuilder().setName("uyari-ver").setDescription("Üyeye resmi uyarı ekler.").addUserOption(o=>o.setName("uye").setDescription("Üye").setRequired(true)).addStringOption(o=>o.setName("sebep").setDescription("Sebep").setRequired(true)),
  async execute(interaction) {
    if (!hasMod(interaction)) return reply(interaction,err("Yetki gerekli","Moderasyon yetkisi gerekir."));
    const m=interaction.options.getMember("üye"), reason=interaction.options.getString("sebep"), db=loadDb(); db.warnings[interaction.guildId] ||= {}; db.warnings[interaction.guildId][m.id] ||= [];
    db.warnings[interaction.guildId][m.id].push({reason,by:interaction.user.id,at:Date.now()}); saveDb(db); record(interaction.guildId,m.id,"uyari",reason);
    return reply(interaction,ok("Uyarı eklendi",`${m.user.tag} kullanıcısına uyarı eklendi.`));
  }
};
