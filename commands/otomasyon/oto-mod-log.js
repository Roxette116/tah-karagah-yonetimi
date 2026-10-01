const { SlashCommandBuilder } = require("discord.js");
const { ok, err, info, warn, reply, loadDb, saveDb, guildConfig, record, hasMod, normalizeTag } = require("../../utils/helpers");

module.exports = {
  data: new SlashCommandBuilder().setName("oto-mod-log").setDescription("Moderasyon log kanalını ayarlar.").addChannelOption(o=>o.setName("kanal").setDescription("Log kanalı").setRequired(true)),
  async execute(interaction) {
    if (!hasMod(interaction)) return reply(interaction, err("Yetki gerekli", "Yönet yetkisi gerekir."));
    const channel=interaction.options.getChannel("kanal"); const {db,cfg}=guildConfig(interaction.guildId); cfg.modLog=channel.id; saveDb(db);
    return reply(interaction, ok("Mod-log ayarlandı", `${channel} log kanalı oldu.`));
  }
};
