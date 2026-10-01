const { SlashCommandBuilder } = require("discord.js");
const { ok, err, info, warn, reply, loadDb, saveDb, guildConfig, record, hasMod, normalizeTag } = require("../../utils/helpers");

module.exports = {
  data: new SlashCommandBuilder().setName("oto-yedekle").setDescription("Sunucu kanal ve rol yapısını JSON olarak yedekler."),
  async execute(interaction) {
    if (!hasMod(interaction)) return reply(interaction, err("Yetki gerekli", "Yönet yetkisi gerekir."));
    const db=loadDb(); db.backups[interaction.guildId] ||= []; const backup={
      at:new Date().toISOString(),
      roles:interaction.guild.roles.cache.filter(r=>r.id!==interaction.guild.id).map(r=>({name:r.name,color:r.hexColor,position:r.position,permissions:r.permissions.bitfield.toString()})),
      channels:interaction.guild.channels.cache.map(c=>({name:c.name,type:c.type,parent:c.parentId,position:c.rawPosition}))
    }; db.backups[interaction.guildId].push(backup); saveDb(db);
    return reply(interaction, ok("Yedek alındı", `Roller: **${backup.roles.length}** • Kanallar: **${backup.channels.length}** • Tarih: <t:${Math.floor(Date.now()/1000)}:F>`));
  }
};
