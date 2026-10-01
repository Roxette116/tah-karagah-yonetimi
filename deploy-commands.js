require("dotenv").config();
const fs = require("node:fs");
const path = require("node:path");
const { REST, Routes } = require("discord.js");
const config = require("./config.json");

if (!process.env.DISCORD_TOKEN) {
  console.error("❌ DISCORD_TOKEN bulunamadı. .env dosyanı kontrol et.");
  process.exit(1);
}
if (!config.clientId || config.clientId === "BOT_CLIENT_ID") {
  console.error("❌ config.json > clientId ayarlanmadı.");
  process.exit(1);
}

const commands = [];
for (const folder of ["otomasyon", "moderasyon"]) {
  const dir = path.join(__dirname, "commands", folder);
  if (!fs.existsSync(dir)) continue;

  for (const file of fs.readdirSync(dir).filter(f => f.endsWith(".js"))) {
    try {
      const command = require(path.join(dir, file));
      if (command?.data) commands.push(command.data.toJSON());
    } catch (error) {
      console.error(`❌ ${folder}/${file} yüklenemedi.`);
      throw error;
    }
  }
}

const rest = new REST({ version: "10" }).setToken(process.env.DISCORD_TOKEN);

(async () => {
  try {
    console.log(`⚔️ ${commands.length} slash komutu deploy ediliyor...`);

    if (config.guildId && config.guildId !== "GELISTIRME_SUNUCU_ID") {
      await rest.put(
        Routes.applicationGuildCommands(config.clientId, config.guildId),
        { body: commands }
      );
      console.log(`✅ ${commands.length} komut sunucuya yüklendi.`);
    } else {
      await rest.put(
        Routes.applicationCommands(config.clientId),
        { body: commands }
      );
      console.log(`✅ ${commands.length} komut global olarak yüklendi.`);
    }
  } catch (error) {
    console.error("❌ Deploy hatası:", error);
    process.exit(1);
  }
})();
