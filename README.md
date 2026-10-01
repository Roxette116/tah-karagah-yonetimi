# 🇹🇷 TAH | KARARGÂH BOTU

VS Code'da açılıp çalıştırılabilen Discord.js v14 botu.

## İçerik
- 60 mevcut otomasyon + moderasyon komutu korunmuştur.
- Geliştirilmiş çok kategorili embed ticket sistemi.
- Oyun / Discord / Genel destek için ayrı kategori ve birden fazla destek rolü.
- Bilet üstlenme ve bilet kapatma.
- `/duyuru`
- `/aktiflik` (Roblox anlık oyuncu sayısı; doluluk göstermez.)
- `mareşal` mesaj tetikleyicisi.
- Ayrı `deploy-commands.js`.
- İsteğe bağlı ses kanalına otomatik giriş.

## Kurulum
1. VS Code'da klasörü aç.
2. `.env` içine bot tokenını yaz:

```env
DISCORD_TOKEN=BOT_TOKENIN
```

3. `config.json` içine `clientId` ve `guildId` yaz.
4. Terminal:

```bash
npm install
npm run deploy
npm start
```

## Wispbyte
Startup akışı için:

```bash
if [[ -d .git ]] && [[ ${AUTO_UPDATE} == "1" ]]; then git pull; fi; if [[ ! -z ${NODE_PACKAGES} ]]; then /usr/local/bin/npm install ${NODE_PACKAGES}; fi; if [[ ! -z ${UNNODE_PACKAGES} ]]; then /usr/local/bin/npm uninstall ${UNNODE_PACKAGES}; fi; if [ -f /home/container/package.json ]; then /usr/local/bin/npm install; fi; /usr/local/bin/node /home/container/deploy-commands.js && /usr/local/bin/node /home/container/index.js
```

## Ticket kurulumu
Discord'da örnek:

```text
/oto-bilet-sistemi kanal:#destek oyun-kategori:#oyun-destek oyun-roller:123,456 discord-kategori:#discord-destek discord-roller:789,101112 genel-kategori:#genel-bilet genel-roller:131415
```

Rol IDleri virgülle ayrılır. Rol mention'ı da yazılabilir.

Bilet panelinde kullanıcı kategori seçer. Ticket açılınca sadece kullanıcı ve ilgili destek rolleri görebilir. Yetkili `Bileti Üstlen` dediğinde ilgili destek rolleri kanalı göremez; bilet sahibi ve bileti üstlenen yetkili erişmeye devam eder.

## Roblox aktiflik
`/aktiflik placeid:OYUN_PLACE_ID`

veya `config.json`:

```json
"robloxPlaceId": "OYUN_PLACE_ID"
```

## Ses kanalı
`config.json` içinde `voiceChannelId` doldurulursa bot hazır olduğunda o ses kanalına katılmayı dener.

## Komut adı notu
Discord slash komut adlarında Türkçe karakter kullanılamadığı için komutlar ASCII isimlerle tutulmuştur. Örn. `baslik`, `oto-hosgeldin`, `yavas-mod`.
