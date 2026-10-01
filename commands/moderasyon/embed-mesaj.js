const {
    SlashCommandBuilder,
    EmbedBuilder,
    PermissionFlagsBits,
    ChannelType
} = require("discord.js");

const config = require("../../config.json");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("embed-mesaj")
        .setDescription("Bot tarafından embed mesaj gönderir.")
        .addStringOption(option =>
            option
                .setName("baslik")
                .setDescription("Embed başlığı")
                .setRequired(true)
        )
        .addStringOption(option =>
            option
                .setName("mesaj")
                .setDescription("Embed mesajı")
                .setRequired(true)
        )
        .addChannelOption(option =>
            option
                .setName("kanal")
                .setDescription("Mesajın gönderileceği kanal")
                .addChannelTypes(ChannelType.GuildText)
                .setRequired(true)
        )
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild),

    async execute(interaction) {
        const baslik = interaction.options.getString("baslik");
        const mesaj = interaction.options.getString("mesaj");
        const kanal = interaction.options.getChannel("kanal");

        const embed = new EmbedBuilder()
            .setColor(config.defaultColor || "#5865F2")
            .setTitle(baslik)
            .setDescription(mesaj)
            .setFooter({
                text: config.footer || "TAH | Turkish Armed Forces • Karargâh"
            })
            .setTimestamp();

        try {
            await kanal.send({
                embeds: [embed]
            });

            await interaction.reply({
                content: `✅ Embed mesajı ${kanal} kanalına gönderildi.`,
                ephemeral: true
            });

        } catch (error) {
            console.error("Embed mesaj hatası:", error);

            await interaction.reply({
                content: "❌ Embed mesaj gönderilemedi.",
                ephemeral: true
            });
        }
    }
};