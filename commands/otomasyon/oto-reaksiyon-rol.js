const { SlashCommandBuilder } = require("discord.js");
const { ok, err, info, warn, reply, loadDb, saveDb, guildConfig, record, hasMod, normalizeTag } = require("../../utils/helpers");

module.exports = {
  data: new SlashCommandBuilder().setName("oto-reaksiyon-rol").setDescription("Butonla rol verme panelini ayarlar.").addRoleOption(o=>o.setName("rol").setDescription("Verilecek rol").setRequired(true)).addChannelOption(o=>o.setName("kanal").setDescription("Panel kanalı").setRequired(true)),
  async execute(interaction) {
    if (!hasMod(interaction)) return reply(interaction, err("Yetki gerekli", "Yönet yetkisi gerekir."));
    const role=interaction.options.getRole("rol"), channel=interaction.options.getChannel("kanal");
    const { ActionRowBuilder, ButtonBuilder, ButtonStyle }=require("discord.js");
    const row=new ActionRowBuilder().addComponents(new ButtonBuilder().setCustomId(`autorole:${role.id}`).setLabel("🎟️ Rolü Al / Bırak").setStyle(ButtonStyle.Success));
    await channel.send({embeds:[info("Rol Paneli", `${role} rolünü almak/bırakmak için butona bas.`)],components:[row]});
    return reply(interaction, ok("Rol paneli", `${channel} kanalına gönderildi.`));
  }
};
