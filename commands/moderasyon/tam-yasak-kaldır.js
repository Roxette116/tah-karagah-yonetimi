const {
    SlashCommandBuilder,
    PermissionFlagsBits,
    MessageFlags
} = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('tam-yasak-kaldır')
        .setDescription('Kullanıcının botun yetkili olduğu tüm sunuculardaki yasağını kaldırır.')
        .addStringOption(option =>
            option
                .setName('kullanici')
                .setDescription('Yasağı kaldırılacak kullanıcının Discord IDsi')
                .setRequired(true)
        )
        .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers),

    async execute(interaction, client) {
        const userId = interaction.options.getString('kullanici').trim();

        if (!/^\d{17,20}$/.test(userId)) {
            return interaction.reply({
                content: '❌ Geçerli bir Discord kullanıcı IDsi gir.',
                flags: MessageFlags.Ephemeral
            });
        }

        await interaction.deferReply({
            flags: MessageFlags.Ephemeral
        });

        let basarili = 0;
        let bulunamadi = 0;
        let basarisiz = 0;
        const hatalar = [];

        for (const guild of client.guilds.cache.values()) {
            try {
                const botMember = guild.members.me;

                if (!botMember) {
                    basarisiz++;
                    hatalar.push(`${guild.name} — Bot üye bilgisi alınamadı`);
                    continue;
                }

                if (!botMember.permissions.has(PermissionFlagsBits.BanMembers)) {
                    basarisiz++;
                    hatalar.push(`${guild.name} — Ban Members yetkisi yok`);
                    continue;
                }

                await guild.bans.remove(
                    userId,
                    `TAH Tam Yasak kaldırıldı | İşlemi yapan: ${interaction.user.tag}`
                );

                basarili++;

            } catch (error) {
                // Kullanıcı zaten yasaklı değilse
                if (
                    error.code === 10026 ||
                    error.code === 10013
                ) {
                    bulunamadi++;
                } else {
                    basarisiz++;
                    hatalar.push(`${guild.name} — ${error.message}`);
                }
            }
        }

        let sonuc =
            `🟢 **TAM YASAK KALDIRILDI**\n\n` +
            `👤 Kullanıcı: <@${userId}>\n` +
            `🆔 ID: \`${userId}\`\n\n` +
            `✅ Yasağı kaldırılan: **${basarili} sunucu**\n` +
            `ℹ️ Yasak bulunmayan: **${bulunamadi} sunucu**\n` +
            `❌ Başarısız: **${basarisiz} sunucu**`;

        if (hatalar.length > 0) {
            sonuc += `\n\n**Başarısız olanlar:**\n`;

            for (const hata of hatalar.slice(0, 10)) {
                sonuc += `• ${hata}\n`;
            }
        }

        await interaction.editReply({
            content: sonuc
        });
    }
};