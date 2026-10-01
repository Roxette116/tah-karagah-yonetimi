const { SlashCommandBuilder } = require("discord.js");
const { ok, err, info, warn, reply, loadDb, saveDb, guildConfig, record, hasMod, normalizeTag } = require("../../utils/helpers");

module.exports = {
  data: new SlashCommandBuilder().setName("oto-sayac").setDescription("Üye hedefi sayaç kanalını ayarlar.").addChannelOption(o=>o.setName("kanal").setDescription("Sayaç kanalı").setRequired(true)).addIntegerOption(o=>o.setName("hedef").setDescription("Üye hedefi").setRequired(true).setMinValue(1)),
  async execute(interaction) {
    if (!hasMod(interaction)) return reply(interaction, err("Yetki gerekli", "Yönet yetkisi gerekir."));
    const channel=interaction.options.getChannel("kanal"), target=interaction.options.getInteger("hedef"); const {db,cfg}=guildConfig(interaction.guildId);
    cfg.counter={channel:channel.id,target}; saveDb(db); return reply(interaction, ok("Sayaç ayarlandı", `${channel} → hedef **${target}**`));
  }
};
