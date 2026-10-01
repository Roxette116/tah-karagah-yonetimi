const { SlashCommandBuilder } = require("discord.js");
const { ok, err, info, warn, reply, loadDb, saveDb, guildConfig, record, hasMod, normalizeTag } = require("../../utils/helpers");

module.exports = {
  data: new SlashCommandBuilder().setName("rol-ver").setDescription("Üyeye rol verir.").addUserOption(o=>o.setName("uye").setDescription("Üye").setRequired(true)).addRoleOption(o=>o.setName("rol").setDescription("Rol").setRequired(true)),
  async execute(interaction) {
    if (!interaction.memberPermissions?.has("ManageRoles")) return reply(interaction,err("Yetki gerekli","Rolleri Yönet yetkisi gerekir."));
    const m=interaction.options.getMember("üye"), r=interaction.options.getRole("rol"); if(!r.editable) return reply(interaction,err("Rol verilemedi","Botun rolü bu rolden aşağıda."));
    await m.roles.add(r); return reply(interaction,ok("Rol verildi",`${m} kullanıcısına ${r} verildi.`));
  }
};
