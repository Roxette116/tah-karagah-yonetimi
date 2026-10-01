const { Events, ActivityType } = require("discord.js");
const { joinVoiceChannel } = require("@discordjs/voice");
const config = require("../config.json");

module.exports = {
  name: Events.ClientReady,
  once: true,
  async execute(client) {
    console.log(`✅ ${client.user.tag} aktif!`);
    console.log(`🏛️ ${client.guilds.cache.size} sunucu • ${client.commands.size} slash komutu`);

    client.user.setPresence({
      activities: [{ name: "TAH | Karargâh", type: ActivityType.Watching }],
      status: "online"
    });

    if (!config.voiceChannelId) return;

    try {
      const channel = client.channels.cache.get(config.voiceChannelId);
      if (!channel || !channel.isVoiceBased()) {
        console.log("⚠️ voiceChannelId geçerli bir ses kanalı değil.");
        return;
      }

      joinVoiceChannel({
        channelId: channel.id,
        guildId: channel.guild.id,
        adapterCreator: channel.guild.voiceAdapterCreator,
        selfDeaf: true,
        selfMute: true
      });

      console.log(`🔊 Ses kanalına girildi: ${channel.name}`);
    } catch (error) {
      console.error("❌ Ses kanalına giriş hatası:", error);
    }
  }
};
