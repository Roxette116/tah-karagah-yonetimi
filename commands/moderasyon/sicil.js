const { SlashCommandBuilder } = require("discord.js");
const { ok, err, info, warn, reply, loadDb, saveDb, guildConfig, record, hasMod, normalizeTag } = require("../../utils/helpers");

module.exports = {
  data: new SlashCommandBuilder().setName("sicil").setDescription("Kullanıcının moderasyon geçmişini gösterir.").addUserOption(o=>o.setName("uye").setDescription("Üye")),
  async execute(interaction) {
    const m=interaction.options.getMember("üye")||interaction.member, db=loadDb(), arr=db.history[interaction.guildId]?.[m.id]||[];
    const lines=arr.slice(-20).reverse().map(x=>`• **${x.action}** — ${x.reason||"—"} — <t:${Math.floor(x.at/1000)}:R>`);
    return reply(interaction,info("Sicil",lines.length?lines.join("\n"):"Kayıt bulunamadı."));
  }
};
