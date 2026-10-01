const {
    SlashCommandBuilder,
    PermissionFlagsBits,
    MessageFlags
} = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('tam-yasak')
        .setDescription('Kullanıcıyı botun yetkili olduğu tüm sunucularda yasaklar.')
        .addStringOption(option =>
            option
                .setName('kullanici')
                .setDescription('Yasaklanacak kullanıcının Discord IDsi')
                .setRequired(true)
        )
        .addStringOption(option =>
            option
                .setName('sebep')
                .setDescription('Yasaklama sebebi')
                .setRequired(false)
        )
        .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers),

    async execute(interaction, client) {
        const userId = interaction.options.getString('kullanici').trim();
        const sebep =
            interaction.options.getString('sebep') ||
            'TAH Tam Yasak Sistemi';

        // Discord ID kontrolü
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

                // Botun ban yetkisi var mı?
                if (!botMember.permissions.has(PermissionFlagsBits.BanMembers)) {
                    basarisiz++;
                    hatalar.push(`${guild.name} — Ban Members yetkisi yok`);
                    continue;
                }

                // Kullanıcıyı doğrudan ID ile yasakla
                await guild.bans.create(userId, {
                    reason: `${sebep} | İşlemi yapan: ${interaction.user.tag}`
                });

                basarili++;

            } catch (error) {
                basarisiz++;
                hatalar.push(`${guild.name} — ${error.message}`);
            }
        }

        let sonuc =
            `🔴 **TAM YASAK UYGULANDI**\n\n` +
            `👤 Kullanıcı: <@${userId}>\n` +
            `🆔 ID: \`${userId}\`\n` +
            `📝 Sebep: **${sebep}**\n\n` +
            `✅ Başarılı: **${basarili} sunucu**\n` +
            `❌ Başarısız: **${basarisiz} sunucu**`;

        if (hatalar.length > 0) {
            sonuc += `\n\n**Başarısız olanlar:**\n`;

            for (const hata of hatalar.slice(0, 10)) {
                sonuc += `• ${hata}\n`;
            }

            if (hatalar.length > 10) {
                sonuc += `• Ve ${hatalar.length - 10} sunucu daha...`;
            }
        }

        await interaction.editReply({
            content: sonuc
        });
    }
};