const { SlashCommandBuilder } = require("discord.js");
const { ok, err, info, warn, reply, loadDb, saveDb, guildConfig, record, hasMod, normalizeTag } = require("../../utils/helpers");

module.exports = {
  data: new SlashCommandBuilder().setName("oto-cevap-sil").setDescription("Otomatik cevap siler.").addStringOption(o => o.setName("kelime").setDescription("Silinecek kelime").setRequired(true)),
  async execute(interaction) {
    if (!hasMod(interaction)) return reply(interaction, err("Yetki gerekli", "Yönet yetkisi gerekir."));
    const key = interaction.options.getString("kelime").toLowerCase(); const db = loadDb();
    if (!db.autoresponses[interaction.guildId]?.[key]) return reply(interaction, warn("Bulunamadı", "Bu kelime için kayıt yok."));
    delete db.autoresponses[interaction.guildId][key]; saveDb(db); return reply(interaction, ok("Silindi", `**${key}** otomatik cevabı kaldırıldı.`));
  }
};
