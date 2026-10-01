const { SlashCommandBuilder } = require("discord.js");
const { ok, err, info, warn, reply, loadDb, saveDb, guildConfig, record, hasMod, normalizeTag } = require("../../utils/helpers");

module.exports = {
  data: new SlashCommandBuilder().setName("oto-cevap-ekle").setDescription("Kelimeye otomatik cevap ekler.").addStringOption(o => o.setName("kelime").setDescription("Tetikleyici kelime").setRequired(true)).addStringOption(o => o.setName("cevap").setDescription("Botun cevabı").setRequired(true)),
  async execute(interaction) {
    if (!hasMod(interaction)) return reply(interaction, err("Yetki gerekli", "Yönet yetkisi gerekir."));
    const key = interaction.options.getString("kelime").toLowerCase();
    const answer = interaction.options.getString("cevap");
    const db = loadDb(); db.autoresponses[interaction.guildId] ||= {}; db.autoresponses[interaction.guildId][key] = answer; saveDb(db);
    return reply(interaction, ok("Otomatik cevap eklendi", `**${key}** kelimesine artık otomatik cevap verilecek.`));
  }
};
