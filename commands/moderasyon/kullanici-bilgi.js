const { SlashCommandBuilder } = require("discord.js");
const { ok, err, info, warn, reply, loadDb, saveDb, guildConfig, record, hasMod, normalizeTag } = require("../../utils/helpers");

module.exports = {
  data: new SlashCommandBuilder().setName("kullanici-bilgi").setDescription("Üyenin katılım ve rol bilgilerini gösterir.").addUserOption(o=>o.setName("uye").setDescription("Üye")),
  async execute(interaction) {
    const m=interaction.options.getMember("üye")||interaction.member; return reply(interaction,info("Kullanıcı Bilgisi",`${m}`,[
      {name:"Kullanıcı",value:m.user.tag,inline:true},{name:"ID",value:m.id,inline:true},{name:"Katılım",value:m.joinedTimestamp?`<t:${Math.floor(m.joinedTimestamp/1000)}:F>`:"Bilinmiyor"},
      {name:"Roller",value:m.roles.cache.filter(r=>r.id!==interaction.guild.id).map(r=>r.toString()).join(" ")||"Yok"}]));
  }
};
