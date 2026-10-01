const { SlashCommandBuilder } = require("discord.js");
const { ok, err, info, warn, reply, loadDb, saveDb, guildConfig, record, hasMod, normalizeTag } = require("../../utils/helpers");

module.exports = {
  data: new SlashCommandBuilder().setName("rol-olustur").setDescription("Yeni rol oluşturur.").addStringOption(o=>o.setName("isim").setDescription("Rol adı").setRequired(true)).addBooleanOption(o=>o.setName("yonetici").setDescription("Yönetici yetkisi ver")),
  async execute(interaction) {
    if (!interaction.memberPermissions?.has("ManageRoles")) return reply(interaction,err("Yetki gerekli","Rolleri Yönet yetkisi gerekir."));
    const name=interaction.options.getString("isim"), admin=interaction.options.getBoolean("yonetici")||false;
    const r=await interaction.guild.roles.create({name,permissions:admin?["Administrator"]:[]}); return reply(interaction,ok("Rol oluşturuldu",`${r} rolü oluşturuldu.`));
  }
};
