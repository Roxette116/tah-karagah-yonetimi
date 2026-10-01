const { SlashCommandBuilder } = require("discord.js");
const { ok, err, info, warn, reply, loadDb, saveDb, guildConfig, record, hasMod, normalizeTag } = require("../../utils/helpers");

module.exports = {
  data: new SlashCommandBuilder().setName("unban").setDescription("Yasaklı kullanıcının engelini kaldırır.").addStringOption(o=>o.setName("kullanici-id").setDescription("Kullanıcı ID").setRequired(true)),
  async execute(interaction) {
    if (!hasMod(interaction)) return reply(interaction, err("Yetki gerekli", "Üyeleri Yasakla yetkisi gerekir."));
    const id=interaction.options.getString("kullanici-id"); try { await interaction.guild.members.unban(id); record(interaction.guildId,id,"unban"); return reply(interaction,ok("Yasak kaldırıldı", `<@${id}> kullanıcısının yasağı kaldırıldı.`)); } catch { return reply(interaction,err("Bulunamadı","Kullanıcı yasaklı değil veya ID geçersiz.")); }
  }
};
