const { SlashCommandBuilder } = require("discord.js");
const { ok, err, info, warn, reply, loadDb, saveDb, guildConfig, record, hasMod, normalizeTag } = require("../../utils/helpers");

module.exports = {
  data: new SlashCommandBuilder().setName("bot-bilgi").setDescription("Botun uptime, RAM ve ping bilgisini gösterir."),
  async execute(interaction) {
    const os=require("node:os"); const mem=process.memoryUsage(); return reply(interaction,info("Bot Bilgisi",`🤖 **${interaction.client.user.tag}**`,[
      {name:"Ping",value:`${interaction.client.ws.ping} ms`,inline:true},{name:"Uptime",value:`<t:${Math.floor((Date.now()-interaction.client.readyAt.getTime()-0)/1000)}:R>`,inline:true},
      {name:"RAM",value:`${(mem.rss/1024/1024).toFixed(1)} MB`,inline:true},{name:"Node.js",value:process.version,inline:true},{name:"Discord.js",value:require("discord.js").version,inline:true},{name:"CPU",value:os.cpus()[0]?.model||"Bilinmiyor"}]));
  }
};
