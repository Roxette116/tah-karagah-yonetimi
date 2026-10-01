const { SlashCommandBuilder } = require("discord.js");
const { ok, err, info, warn, reply, loadDb, saveDb, guildConfig, record, hasMod, normalizeTag } = require("../../utils/helpers");

module.exports = {
  data: new SlashCommandBuilder().setName("uyari-sil").setDescription("Üyenin belirtilen uyarısını siler.").addUserOption(o=>o.setName("uye").setDescription("Üye").setRequired(true)).addIntegerOption(o=>o.setName("no").setDescription("Uyarı numarası").setRequired(true).setMinValue(1)),
  async execute(interaction) {
    if (!hasMod(interaction)) return reply(interaction,err("Yetki gerekli","Moderasyon yetkisi gerekir."));
    const m=interaction.options.getMember("üye"), no=interaction.options.getInteger("no"), db=loadDb(), arr=db.warnings[interaction.guildId]?.[m.id]||[];
    if(!arr[no-1]) return reply(interaction,warn("Uyarı bulunamadı","Bu numarada uyarı yok.")); arr.splice(no-1,1); saveDb(db); return reply(interaction,ok("Uyarı silindi",`${m.user.tag} kullanıcısının #${no} uyarısı silindi.`));
  }
};
