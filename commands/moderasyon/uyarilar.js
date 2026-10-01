const { SlashCommandBuilder } = require("discord.js");
const { ok, err, info, warn, reply, loadDb, saveDb, guildConfig, record, hasMod, normalizeTag } = require("../../utils/helpers");

module.exports = {
  data: new SlashCommandBuilder().setName("uyarilar").setDescription("Üyenin uyarı geçmişini gösterir.").addUserOption(o=>o.setName("uye").setDescription("Üye").setRequired(true)),
  async execute(interaction) {
    const m=interaction.options.getMember("üye")||interaction.member, db=loadDb(), arr=db.warnings[interaction.guildId]?.[m.id]||[];
    const lines=arr.map((w,i)=>`**#${i+1}** • ${w.reason} • <t:${Math.floor(w.at/1000)}:R> • <@${w.by}>`);
    return reply(interaction,info("Uyarı geçmişi",lines.length?lines.join("\n"):"Bu üyenin uyarısı yok."));
  }
};
