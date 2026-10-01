const { SlashCommandBuilder } = require("discord.js");
const { ok, err, info, warn, reply, loadDb, saveDb, guildConfig, record, hasMod, normalizeTag } = require("../../utils/helpers");

module.exports = {
  data: new SlashCommandBuilder().setName("karaliste").setDescription("Kullanıcının bot komutlarını kullanmasını engeller veya kaldırır.").addUserOption(o=>o.setName("uye").setDescription("Kullanıcı").setRequired(true)).addBooleanOption(o=>o.setName("engelle").setDescription("True=engelle, False=kaldır").setRequired(true)).addStringOption(o=>o.setName("sebep").setDescription("Sebep")),
  async execute(interaction) {
    if (!interaction.memberPermissions?.has("ManageGuild")) return reply(interaction,err("Yetki gerekli","Sunucuyu Yönet yetkisi gerekir."));
    const u=interaction.options.getUser("üye"), block=interaction.options.getBoolean("engelle"), reason=interaction.options.getString("sebep")||"Belirtilmedi"; const db=loadDb();
    db.blacklist[interaction.guildId] ||= {}; if(block) db.blacklist[interaction.guildId][u.id]={reason,at:Date.now()}; else delete db.blacklist[interaction.guildId][u.id]; saveDb(db);
    return reply(interaction,ok("Kara liste güncellendi",`${u.tag}: **${block?"Engellendi":"Engeli kaldırıldı"}**`));
  }
};
