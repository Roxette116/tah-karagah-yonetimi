const { SlashCommandBuilder } = require("discord.js");
const { ok, err, info, warn, reply, loadDb, saveDb, guildConfig, record, hasMod, normalizeTag } = require("../../utils/helpers");

module.exports = {
  data: new SlashCommandBuilder().setName("timeout").setDescription("Üyeye süreli susturma uygular.").addUserOption(o=>o.setName("uye").setDescription("Üye").setRequired(true)).addIntegerOption(o=>o.setName("dakika").setDescription("Dakika").setRequired(true).setMinValue(1).setMaxValue(40320)).addStringOption(o=>o.setName("sebep").setDescription("Sebep")),
  async execute(interaction) {
    if (!hasMod(interaction)) return reply(interaction,err("Yetki gerekli","Üyeleri Zaman Aşımına Uğrat yetkisi gerekir."));
    const member=interaction.options.getMember("üye"), min=interaction.options.getInteger("dakika"), reason=interaction.options.getString("sebep")||"Sebep belirtilmedi.";
    if(!member?.moderatable) return reply(interaction,err("İşlem yapılamadı","Bu üyeye timeout uygulayamıyorum."));
    await member.timeout(min*60000,reason); record(interaction.guildId,member.id,"timeout",reason); return reply(interaction,ok("Timeout uygulandı",`${member.user.tag} **${min} dakika** susturuldu.`));
  }
};
