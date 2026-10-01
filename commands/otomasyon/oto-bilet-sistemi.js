const {
  SlashCommandBuilder,
  EmbedBuilder,
  ActionRowBuilder,
  StringSelectMenuBuilder,
  StringSelectMenuOptionBuilder,
  PermissionFlagsBits,
  ChannelType
} = require("discord.js");
const { loadDb, saveDb, hasMod, reply, ok, err } = require("../../utils/helpers");

function splitIds(value) {
  return String(value || "")
    .split(",")
    .map(x => x.trim().replace(/[<@&>]/g, ""))
    .filter(Boolean);
}

module.exports = {
  data: new SlashCommandBuilder()
    .setName("oto-bilet-sistemi")
    .setDescription("TAH için şık ve çok kategorili bilet paneli kurar.")
    .addChannelOption(o => o
      .setName("kanal")
      .setDescription("Bilet panelinin gönderileceği yazı kanalı")
      .addChannelTypes(ChannelType.GuildText, ChannelType.GuildAnnouncement)
      .setRequired(true))
    .addChannelOption(o => o
      .setName("oyun-kategori")
      .setDescription("Oyun destek biletlerinin açılacağı kategori")
      .addChannelTypes(ChannelType.GuildCategory)
      .setRequired(false))
    .addStringOption(o => o
      .setName("oyun-roller")
      .setDescription("Oyun destek rol IDleri: ID,ID,ID")
      .setRequired(false))
    .addChannelOption(o => o
      .setName("discord-kategori")
      .setDescription("Discord destek biletlerinin açılacağı kategori")
      .addChannelTypes(ChannelType.GuildCategory)
      .setRequired(false))
    .addStringOption(o => o
      .setName("discord-roller")
      .setDescription("Discord destek rol IDleri: ID,ID,ID")
      .setRequired(false))
    .addChannelOption(o => o
      .setName("genel-kategori")
      .setDescription("Genel biletlerin açılacağı kategori")
      .addChannelTypes(ChannelType.GuildCategory)
      .setRequired(false))
    .addStringOption(o => o
      .setName("genel-roller")
      .setDescription("Genel destek rol IDleri: ID,ID,ID")
      .setRequired(false))
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild),

  async execute(interaction) {
    if (!hasMod(interaction)) {
      return reply(interaction, err("Yetki gerekli", "Bu sistemi kurmak için Sunucuyu Yönet yetkisi gerekir."));
    }

    const panelChannel = interaction.options.getChannel("kanal");
    const options = {
      oyun: {
        category: interaction.options.getChannel("oyun-kategori")?.id || null,
        roles: splitIds(interaction.options.getString("oyun-roller"))
      },
      discord: {
        category: interaction.options.getChannel("discord-kategori")?.id || null,
        roles: splitIds(interaction.options.getString("discord-roller"))
      },
      genel: {
        category: interaction.options.getChannel("genel-kategori")?.id || null,
        roles: splitIds(interaction.options.getString("genel-roller"))
      }
    };

    const db = loadDb();
    db.guilds[interaction.guildId] ||= {};
    db.guilds[interaction.guildId].ticketConfig ||= {};
    const current = db.guilds[interaction.guildId].ticketConfig;

    for (const key of Object.keys(options)) {
      if (options[key].category) current[key] = { ...(current[key] || {}), category: options[key].category };
      if (options[key].roles.length) current[key] = { ...(current[key] || {}), roles: options[key].roles };
    }

    db.guilds[interaction.guildId].ticketConfig = current;
    saveDb(db);

    const embed = new EmbedBuilder()
      .setColor("#5865F2")
      .setAuthor({ name: "🇹🇷 TAH | KARARGÂH" })
      .setTitle("TAH DESTEK MERKEZİ")
      .setDescription(
        "**Destek almak için aşağıdaki menüden uygun kategoriyi seçiniz.**\n\n" +
        "📌 **Bilet açmadan önce okuyunuz:**\n" +
        "• Konunuzu doğrudan ve anlaşılır biçimde yazınız.\n" +
        "• Gereksiz yere bilet açmayınız.\n" +
        "• Yetkilileri gereksiz yere etiketlemeyiniz.\n" +
        "• Reklam veya TAH kapsamı dışındaki konuları bilete taşımayınız.\n\n" +
        "⚠️ **Not:** Bir yetkili bileti üstlenene kadar ilgili destek ekibi yanıt verebilir. " +
        "Üstlenildikten sonra kanal, bileti açan kişi ve bileti üstlenen yetkili için açık kalır."
      )
      .addFields({
        name: "🎫 Bilet Kategorileri",
        value: "🎮 Oyun Destek\n💬 Discord Destek\n📁 Genel Destek",
        inline: false
      })
      .setFooter({ text: "TAH Destek Sistemi" })
      .setTimestamp();

    const menu = new StringSelectMenuBuilder()
      .setCustomId("bilet:kategori")
      .setPlaceholder("🎫 Destek kategorisini seçiniz...")
      .addOptions(
        new StringSelectMenuOptionBuilder()
          .setLabel("Oyun Destek")
          .setDescription("Roblox / oyun içi konular")
          .setEmoji("🎮")
          .setValue("oyun"),
        new StringSelectMenuOptionBuilder()
          .setLabel("Discord Destek")
          .setDescription("Sunucu ve Discord sorunları")
          .setEmoji("💬")
          .setValue("discord"),
        new StringSelectMenuOptionBuilder()
          .setLabel("Genel Destek")
          .setDescription("Diğer destek talepleri")
          .setEmoji("📁")
          .setValue("genel")
      );

    const row = new ActionRowBuilder().addComponents(menu);

    await panelChannel.send({ embeds: [embed], components: [row] });
    return reply(interaction, ok("Bilet sistemi kuruldu", `${panelChannel} kanalına TAH destek paneli gönderildi.`));
  }
};
