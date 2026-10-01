require("dotenv").config();
const fs = require("node:fs");
const path = require("node:path");
const { Client, Collection, GatewayIntentBits, Partials } = require("discord.js");

if (!process.env.DISCORD_TOKEN) {
  console.error("❌ DISCORD_TOKEN .env içinde ayarlanmadı.");
  process.exit(1);
}

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildModeration,
    GatewayIntentBits.GuildVoiceStates
  ],
  partials: [Partials.Channel, Partials.Message, Partials.GuildMember]
});

client.commands = new Collection();

for (const folder of ["otomasyon", "moderasyon"]) {
  const dir = path.join(__dirname, "commands", folder);
  if (!fs.existsSync(dir)) continue;

  for (const file of fs.readdirSync(dir).filter(f => f.endsWith(".js"))) {
    try {
      const command = require(path.join(dir, file));
      if (!command?.data?.name) {
        console.warn(`⚠️ Komut atlandı: ${folder}/${file}`);
        continue;
      }
      client.commands.set(command.data.name, command);
    } catch (error) {
      console.error(`❌ Komut yüklenemedi: ${folder}/${file}`);
      console.error(error);
      process.exit(1);
    }
  }
}

const eventsDir = path.join(__dirname, "events");
for (const file of fs.readdirSync(eventsDir).filter(f => f.endsWith(".js"))) {
  const event = require(path.join(eventsDir, file));
  if (event.once) client.once(event.name, (...args) => event.execute(...args));
  else client.on(event.name, (...args) => event.execute(...args));
}

console.log(`📦 ${client.commands.size} komut hazır.`);
client.login(process.env.DISCORD_TOKEN);
