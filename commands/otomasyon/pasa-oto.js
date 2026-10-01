const {
    SlashCommandBuilder,
    PermissionFlagsBits
} = require('discord.js');

const { loadDb, saveDb } = require('../../utils/helpers');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('pasa-oto')
        .setDescription('Paşa otomatik cevap sistemini açar veya kapatır.')
        .addStringOption(option =>
            option
                .setName('durum')
                .setDescription('Sistemin durumunu belirle')
                .setRequired(true)
                .addChoices(
                    { name: 'Aç', value: 'ac' },
                    { name: 'Kapat', value: 'kapat' }
                )
        )
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

    async execute(interaction) {
        const db = loadDb();

        db.pasaOto ||= {
            aktif: false,
            kanallar: [],
            kullanicilar: []
        };

        const durum = interaction.options.getString('durum');

        if (durum === 'ac') {
            db.pasaOto.aktif = true;

            if (!db.pasaOto.kanallar.includes(interaction.channel.id)) {
                db.pasaOto.kanallar.push(interaction.channel.id);
            }

            saveDb(db);

            return interaction.reply({
                content: '🫡 Paşa otomatik cevap sistemi bu kanalda **aktif edildi**.',
                ephemeral: true
            });
        }

        db.pasaOto.kanallar =
            db.pasaOto.kanallar.filter(
                id => id !== interaction.channel.id
            );

        if (db.pasaOto.kanallar.length === 0) {
            db.pasaOto.aktif = false;
        }

        saveDb(db);

        return interaction.reply({
            content: '🔕 Paşa otomatik cevap sistemi bu kanalda **kapatıldı**.',
            ephemeral: true
        });
    }
};