const { Events } = require("discord.js");
const { loadDb, warn } = require("../utils/helpers");
module.exports = {
  name: Events.GuildMemberRemove,
  async execute(member) {
    const db=loadDb(), cfg=db.guilds[member.guild.id]||{};
    if(cfg.goodbyeChannel){
      const ch=member.guild.channels.cache.get(cfg.goodbyeChannel);
      if(ch) await ch.send({embeds:[warn("Görüşürüz!", `**${member.user.tag}** sunucudan ayrıldı.`, [
        {name:"Kalan üye",value:String(member.guild.memberCount),inline:true}
      ])]}).catch(()=>{});
    }
  }
};
