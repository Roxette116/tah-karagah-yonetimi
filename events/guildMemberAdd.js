const { Events } = require("discord.js");
const { loadDb, saveDb, ok, info, warn } = require("../utils/helpers");

module.exports = {
  name: Events.GuildMemberAdd,
  async execute(member) {
    const db=loadDb(), cfg=db.guilds[member.guild.id]||{};
    if (cfg.autoRole) {
      const role=member.guild.roles.cache.get(cfg.autoRole);
      if(role && role.editable) await member.roles.add(role).catch(()=>{});
    }
    if (cfg.autoTag?.active) {
      const tag=cfg.autoTag.tag;
      await member.setNickname(`${tag}${member.displayName}`.slice(0,32)).catch(()=>{});
    }
    if (cfg.security) {
      const ageDays=(Date.now()-member.user.createdTimestamp)/86400000;
      if(ageDays<cfg.security.days){
        const role=member.guild.roles.cache.get(cfg.security.role);
        if(role && role.editable) await member.roles.add(role).catch(()=>{});
        await member.send({embeds:[warn("Güvenlik karantinası",`Hesabın ${cfg.security.days} günden yeni olduğu için **${member.guild.name}** sunucusunda geçici karantinaya alındın.`)]}).catch(()=>{});
      }
    }
    if(cfg.welcomeChannel){
      const ch=member.guild.channels.cache.get(cfg.welcomeChannel);
      if(ch) await ch.send({embeds:[ok("Hoş geldin!",`${member} **${member.guild.name}** sunucusuna katıldı!`,[
        {name:"Üye",value:member.user.tag,inline:true},{name:"Üye sayısı",value:String(member.guild.memberCount),inline:true}
      ])]}).catch(()=>{});
    }
  }
};
