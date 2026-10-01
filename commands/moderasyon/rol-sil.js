const { SlashCommandBuilder } = require("discord.js");
const { ok, err, info, warn, reply, loadDb, saveDb, guildConfig, record, hasMod, normalizeTag } = require("../../utils/helpers");

module.exports = {
  data: new SlashCommandBuilder().setName("rol-sil").setDescription("Belirtilen rolü siler.").addRoleOption(o=>o.setName("rol").setDescription("Silinecek rol").setRequired(true)),
  async execute(interaction) {
    if (!interaction.memberPermissions?.has("ManageRoles")) return reply(interaction,err("Yetki gerekli","Rolleri Yönet yetkisi gerekir."));
    const r=interaction.options.getRole("rol"); if(!r.editable) return reply(interaction,err("Silinemedi","Bot bu rolü yönetemiyor.")); await r.delete("Moderasyon komutu"); return reply(interaction,ok("Rol silindi",`**${r.name}** silindi.`));
  }
};
