const { SlashCommandBuilder } = require("discord.js");
const { ok, err, info, warn, reply, loadDb, saveDb, guildConfig, record, hasMod, normalizeTag } = require("../../utils/helpers");

module.exports = {
  data: new SlashCommandBuilder().setName("untimeout").setDescription("Üyenin timeout durumunu kaldırır.").addUserOption(o=>o.setName("uye").setDescription("Üye").setRequired(true)),
  async execute(interaction) {
    if (!hasMod(interaction)) return reply(interaction,err("Yetki gerekli","Üyeleri Zaman Aşımına Uğrat yetkisi gerekir."));
    const member=interaction.options.getMember("üye"); if(!member?.moderatable) return reply(interaction,err("İşlem yapılamadı","Bu üyeye erişilemiyor."));
    await member.timeout(null,"Timeout kaldırıldı"); record(interaction.guildId,member.id,"untimeout"); return reply(interaction,ok("Timeout kaldırıldı",`${member.user.tag} artık susturulmuyor.`));
  }
};
