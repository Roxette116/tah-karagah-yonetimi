const { Events } = require("discord.js");

const { loadDb, saveDb } = require("../utils/helpers");
const config = require("../config.json");

const bannedWords = ["amk", "aq", "orospu", "sikik", "piç"];

const links = /(https?:\/\/|www\.)\S+/i;

// Paşa oto cevap cooldownları
// Kanal ID → son cevap zamanı
const pasaCooldown = new Map();

module.exports = {
  name: Events.MessageCreate,

  async execute(message) {
    if (!message.guild || message.author.bot) return;

    // =====================================================
    // TAH EKSTRA TETİKLEYİCİSİ
    // =====================================================

    if (
      message.content.trim().toLocaleLowerCase("tr-TR") === "mareşal"
    ) {
      await message.channel
        .send(
          "Sunucu mareşalleri **GorilChee_01945**, **ArthurFraizer** ve **yigidoo620**"
        )
        .catch(() => {});

      return;
    }

    // =====================================================
    // DATABASE
    // =====================================================

    const db = loadDb();
    const cfg = db.guilds[message.guild.id] || {};
    const text = message.content.toLowerCase();

    // =====================================================
    // PAŞA OTOMATİK CEVAP SİSTEMİ
    // =====================================================

    const pasaOto = db.pasaOto || config.pasaOto || {};

    const pasaAktif = pasaOto.aktif === true;

    const pasaKanallar = Array.isArray(pasaOto.kanallar)
      ? pasaOto.kanallar
      : [];

    const pasaKullanicilar = Array.isArray(pasaOto.kullanicilar)
      ? pasaOto.kullanicilar
      : [];

    // Sadece belirlenen kanallarda
    // ve belirlenen kullanıcılarda çalışır
    if (
      pasaAktif &&
      pasaKanallar.includes(message.channel.id) &&
      pasaKullanicilar.includes(message.author.id)
    ) {
      const simdi = Date.now();
      const sonCevap =
        pasaCooldown.get(message.channel.id) || 0;

      // 15 dakika = 900000 ms
      if (simdi - sonCevap >= 900000) {
        const cevaplar = [
          "Hoş geldiniz paşaların paşası! 🇹🇷",
          "Emret efendim, sizlerin emrindeyim!",
          "Emredersiniz paşam!",
          "Emrinizdeyim paşam!",
          "TAH için sunucuyu koruyorum paşam!",
          "Buyurun paşam, emrinizi bekliyorum.",
          "Paşaların paşası geldi, emrinizdeyim!",
          "Hazırım paşam, emirlerinizi bekliyorum.",
          "Her zaman emrinizdeyim efendim!",
          "TAH Karargâhı görevinin başında paşam!"
        ];

        const cevap =
          cevaplar[
            Math.floor(Math.random() * cevaplar.length)
          ];

        await message.channel
          .send(cevap)
          .catch(() => {});

        // Cevap verildiği andan itibaren 15 dakika bekle
        pasaCooldown.set(
          message.channel.id,
          simdi
        );
      }
    }

    // =====================================================
    // LİNK ENGELİ
    // =====================================================

    if (
      cfg.linkBlock &&
      links.test(message.content) &&
      !message.member.permissions.has("ManageMessages")
    ) {
      await message.delete().catch(() => {});

      const m = await message.channel
        .send(
          `${message.author} bu kanalda bağlantı paylaşamaz.`
        )
        .catch(() => null);

      if (m) {
        setTimeout(
          () => m.delete().catch(() => {}),
          5000
        );
      }

      return;
    }

    // =====================================================
    // KÜFÜR ENGELİ
    // =====================================================

    if (
      cfg.swearBlock &&
      bannedWords.some((w) => text.includes(w)) &&
      !message.member.permissions.has("ManageMessages")
    ) {
      await message.delete().catch(() => {});

      const m = await message.channel
        .send(
          `${message.author} uygunsuz ifade kullanımı nedeniyle uyarıldı.`
        )
        .catch(() => null);

      if (m) {
        setTimeout(
          () => m.delete().catch(() => {}),
          5000
        );
      }

      return;
    }

    // =====================================================
    // SA → ALEYKÜM SELAM
    // =====================================================

    if (
      cfg.saAs &&
      /^(sa|s\.a\.|selamün aleyküm|selamun aleykum)$/i.test(
        message.content.trim()
      )
    ) {
      await message
        .reply("Aleyküm selam, hoş geldin!")
        .catch(() => {});
    }

    // =====================================================
    // OTOMATİK CEVAPLAR
    // =====================================================

    const auto =
      db.autoresponses[message.guild.id] || {};

    for (const [key, answer] of Object.entries(auto)) {
      if (text.includes(key)) {
        await message
          .reply(answer)
          .catch(() => {});

        break;
      }
    }

    // =====================================================
    // LEVEL SİSTEMİ
    // =====================================================

    if (cfg.levels) {
      db.levels[message.guild.id] ||= {};

      const u =
        (db.levels[message.guild.id][message.author.id] ||= {
          xp: 0,
          level: 1
        });

      u.xp += Math.floor(Math.random() * 8) + 8;

      const needed = u.level * 100;

      if (u.xp >= needed) {
        u.xp -= needed;
        u.level++;

        await message.channel
          .send(
            `${message.author} artık **${u.level}. seviye**!`
          )
          .catch(() => {});
      }

      saveDb(db);
    }
  }
};