const { SlashCommandBuilder } = require("discord.js");
const { ok, err, info, warn, reply, loadDb, saveDb, guildConfig, record, hasMod, normalizeTag } = require("../../utils/helpers");

module.exports = {
  data: new SlashCommandBuilder().setName("oto-kanal-kilit").setDescription("Saat aralığında kanalı otomatik kilitleme ayarı.").addChannelOption(o=>o.setName("kanal").setDescription("Kanal").setRequired(true)).addStringOption(o=>o.setName("baslangic").setDescription("HH:MM").setRequired(true)).addStringOption(o=>o.setName("bitis").setDescription("HH:MM").setRequired(true)),
  async execute(interaction) {
    if (!hasMod(interaction)) return reply(interaction, err("Yetki gerekli", "Yönet yetkisi gerekir."));
    const channel=interaction.options.getChannel("kanal"), start=interaction.options.getString("baslangic"), end=interaction.options.getString("bitis");
    if (!/^([01]\d|2[0-3]):[0-5]\d$/.test(start) || !/^([01]\d|2[0-3]):[0-5]\d$/.test(end)) return reply(interaction, err("Saat biçimi", "Saatleri HH:MM biçiminde gir."));
    const {db,cfg}=guildConfig(interaction.guildId); cfg.scheduledLock={channel:start&&channel.id,start,end}; saveDb(db);
    return reply(interaction, ok("Otomatik kilit", `${channel} **${start} - ${end}** arasında kilitlenecek.`));
  }
};
