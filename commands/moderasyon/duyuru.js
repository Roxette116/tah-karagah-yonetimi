const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits, ChannelType, MessageFlags } = require("discord.js");
const { reply, err, ok } = require("../../utils/helpers");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("duyuru")
    .setDescription("TAH temalı embed duyurusu gönderir.")
    .addStringOption(o => o.setName("baslik").setDescription("Duyurunun başlığı").setRequired(true))
    .addStringOption(o => o.setName("mesaj").setDescription("Duyuru metni").setRequired(true))
    .addChannelOption(o => o.setName("kanal").setDescription("Duyurunun gönderileceği kanal").addChannelTypes(ChannelType.GuildText, ChannelType.GuildAnnouncement).setRequired(true))
    .addRoleOption(o => o.setName("rol").setDescription("İsteğe bağlı etiketlenecek rol").setRequired(false))
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild),

  async execute(interaction) {
    const channel = interaction.options.getChannel("kanal");
    const role = interaction.options.getRole("rol");
    const title = interaction.options.getString("baslik");
    const message = interaction.options.getString("mesaj");

    const embed = new EmbedBuilder()
      .setColor("#5865F2")
      .setAuthor({ name: "🇹🇷 TAH | KARARGÂH DUYURUSU" })
      .setTitle(`📢 ${title}`)
      .setDescription(message)
      .addFields(
        { name: "👤 Duyuruyu Yapan", value: `${interaction.user}`, inline: true },
        { name: "📅 Tarih", value: `<t:${Math.floor(Date.now() / 1000)}:F>`, inline: true }
      )
      .setFooter({ text: "TAH | Turkish Armed Forces • Karargâh" })
      .setTimestamp();

    try {
      await channel.send({ content: role ? `${role}` : undefined, embeds: [embed] });
      return reply(interaction, ok("Duyuru gönderildi", `${channel} kanalına başarıyla gönderildi.`));
    } catch (error) {
      console.error(error);
      return interaction.reply({ embeds: [err("Gönderilemedi", "Botun hedef kanala mesaj gönderme yetkisini kontrol et.")], flags: MessageFlags.Ephemeral });
    }
  }
};
