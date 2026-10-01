const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const { reply, err } = require("../../utils/helpers");
const config = require("../../config.json");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("aktiflik")
    .setDescription("Roblox oyununun anlık aktif oyuncu sayısını gösterir.")
    .addStringOption(o => o.setName("placeid").setDescription("Roblox oyununun Place ID değeri").setRequired(false)),

  async execute(interaction) {
    const placeId = interaction.options.getString("placeid") || config.robloxPlaceId;
    if (!placeId) return reply(interaction, err("Place ID eksik", "Komuta placeid gir veya config.json içindeki robloxPlaceId alanını doldur."));

    await interaction.deferReply();

    try {
      const universeResponse = await fetch(`https://apis.roblox.com/universes/v1/places/${encodeURIComponent(placeId)}/universe`);
      if (!universeResponse.ok) throw new Error(`Universe bulunamadı (${universeResponse.status})`);
      const universe = await universeResponse.json();

      const gameResponse = await fetch(`https://games.roblox.com/v1/games?universeIds=${encodeURIComponent(universe.universeId)}`);
      if (!gameResponse.ok) throw new Error(`Oyun bilgisi alınamadı (${gameResponse.status})`);
      const data = await gameResponse.json();
      const game = data.data?.[0];
      if (!game) throw new Error("Roblox oyun verisi boş.");

      const embed = new EmbedBuilder()
        .setColor("#5865F2")
        .setAuthor({ name: "🇹🇷 TAH | KARARGÂH" })
        .setTitle("🎮 ROBLOX OYUN AKTİFLİĞİ")
        .setDescription(`**${game.name}**`)
        .addFields(
          { name: "👥 Aktif Oyuncu", value: `**${game.playing ?? 0}**`, inline: true },
          { name: "👤 Maksimum Oyuncu", value: `**${game.maxPlayers ?? 0}**`, inline: true }
        )
        .setFooter({ text: "TAH | Roblox Aktiflik Sistemi" })
        .setTimestamp();

      return interaction.editReply({ embeds: [embed] });
    } catch (error) {
      console.error("Roblox aktiflik hatası:", error);
      return interaction.editReply({ embeds: [err("Aktiflik alınamadı", "Roblox oyun bilgisine ulaşılamadı. Place ID'yi kontrol et.")] });
    }
  }
};
