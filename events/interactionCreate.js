const {
  Events,
  PermissionFlagsBits,
  ChannelType,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  EmbedBuilder,
  MessageFlags
} = require("discord.js");
const { loadDb, saveDb, ok, err, info, warn } = require("../utils/helpers");

function ticketName(user) {
  const safe = String(user.username || "kullanici")
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, "")
    .slice(0, 45);
  return `bilet-${safe || user.id}`;
}

function getRoles(guild, roleIds = []) {
  return roleIds
    .map(id => guild.roles.cache.get(id))
    .filter(Boolean);
}

module.exports = {
  name: Events.InteractionCreate,

  async execute(interaction) {
    try {
      // ---------------- Slash komutları ----------------
      if (interaction.isChatInputCommand()) {
        const db = loadDb();
        if (interaction.guildId && db.blacklist[interaction.guildId]?.[interaction.user.id]) {
          return interaction.reply({
            embeds: [err("Kara listedesin", "Bu botun komutlarını kullanman engellenmiş.")],
            flags: MessageFlags.Ephemeral
          });
        }

        const command = interaction.client.commands.get(interaction.commandName);
        if (!command) return;
        await command.execute(interaction);
        return;
      }

      // ---------------- Bilet kategori menüsü ----------------
      if (interaction.isStringSelectMenu() && interaction.customId === "bilet:kategori") {
        const db = loadDb();
        const cfg = db.guilds[interaction.guildId]?.ticketConfig || {};
        const type = interaction.values[0];
        const ticketCfg = cfg[type];

        if (!ticketCfg?.category) {
          return interaction.reply({
            embeds: [err("Kategori ayarlanmamış", `**${type}** bilet kategorisi henüz kurulmamış.`)],
            flags: MessageFlags.Ephemeral
          });
        }

        const category = interaction.guild.channels.cache.get(ticketCfg.category);
        if (!category || category.type !== ChannelType.GuildCategory) {
          return interaction.reply({
            embeds: [err("Kategori bulunamadı", "Bilet kategorisi silinmiş veya geçersiz.")],
            flags: MessageFlags.Ephemeral
          });
        }

        db.tickets[interaction.guildId] ||= {};
        const existing = Object.values(db.tickets[interaction.guildId]).find(
          x => x.ownerId === interaction.user.id && !x.closed
        );
        if (existing) {
          const existingChannel = interaction.guild.channels.cache.get(existing.channelId);
          return interaction.reply({
            embeds: [info("Zaten açık biletin var", existingChannel ? `Açık biletin: ${existingChannel}` : "Açık bilet kaydın bulunuyor.")],
            flags: MessageFlags.Ephemeral
          });
        }

        const roles = getRoles(interaction.guild, ticketCfg.roles || []);
        const overwrites = [
          { id: interaction.guild.id, deny: [PermissionFlagsBits.ViewChannel] },
          {
            id: interaction.user.id,
            allow: [
              PermissionFlagsBits.ViewChannel,
              PermissionFlagsBits.SendMessages,
              PermissionFlagsBits.ReadMessageHistory,
              PermissionFlagsBits.AttachFiles,
              PermissionFlagsBits.EmbedLinks
            ]
          },
          ...roles.map(role => ({
            id: role.id,
            allow: [
              PermissionFlagsBits.ViewChannel,
              PermissionFlagsBits.SendMessages,
              PermissionFlagsBits.ReadMessageHistory
            ]
          }))
        ];

        const channel = await interaction.guild.channels.create({
          name: ticketName(interaction.user),
          type: ChannelType.GuildText,
          parent: category.id,
          permissionOverwrites: overwrites,
          topic: `TAH Bilet • ${type} • Sahip: ${interaction.user.id}`
        });

        db.tickets[interaction.guildId][channel.id] = {
          channelId: channel.id,
          ownerId: interaction.user.id,
          type,
          roleIds: roles.map(r => r.id),
          claimedBy: null,
          closed: false,
          createdAt: Date.now()
        };
        saveDb(db);

        const roleMentions = roles.map(r => `<@&${r.id}>`).join(" ");
        const ticketEmbed = new EmbedBuilder()
          .setColor("#5865F2")
          .setAuthor({ name: "🇹🇷 TAH | DESTEK" })
          .setTitle("🎫 Destek Bileti")
          .setDescription(
            `Hoş geldin ${interaction.user}!\n\n` +
            `📂 **Kategori:** ${type === "oyun" ? "Oyun Destek" : type === "discord" ? "Discord Destek" : "Genel Destek"}\n` +
            "📝 Sorununu ayrıntılı olarak açıklayınız.\n" +
            "📎 Gerekli kanıt / ekran görüntülerini ekleyiniz.\n\n" +
            "🛡️ Bir yetkili bileti **Üstlen** butonuna bastığında destek kanalına erişimi o yetkili ile sınırlandırılır."
          )
          .addFields(
            { name: "👤 Bilet Sahibi", value: `${interaction.user}`, inline: true },
            { name: "🛡️ Destek Ekibi", value: roleMentions || "Ayarlanmadı", inline: true }
          )
          .setFooter({ text: "TAH Destek Sistemi • Karargâh" })
          .setTimestamp();

        const buttons = new ActionRowBuilder().addComponents(
          new ButtonBuilder()
            .setCustomId("bilet:ustlen")
            .setLabel("Bileti Üstlen")
            .setEmoji("🎯")
            .setStyle(ButtonStyle.Primary),
          new ButtonBuilder()
            .setCustomId("bilet:kapat")
            .setLabel("Bileti Kapat")
            .setEmoji("🔒")
            .setStyle(ButtonStyle.Danger)
        );

        await channel.send({
          content: `${interaction.user} ${roleMentions}`.trim(),
          embeds: [ticketEmbed],
          components: [buttons]
        });

        return interaction.reply({
          embeds: [ok("Bilet oluşturuldu", `Biletin başarıyla açıldı: ${channel}`)],
          flags: MessageFlags.Ephemeral
        });
      }

      // ---------------- Bilet butonları ----------------
      if (interaction.isButton() && interaction.customId.startsWith("bilet:")) {
        const db = loadDb();
        db.tickets[interaction.guildId] ||= {};
        const ticket = db.tickets[interaction.guildId][interaction.channelId];

        if (!ticket) {
          return interaction.reply({
            embeds: [err("Bilet bulunamadı", "Bu kanal kayıtlı bir TAH bileti değil.")],
            flags: MessageFlags.Ephemeral
          });
        }

        if (interaction.customId === "bilet:ustlen") {
          const isSupport = ticket.roleIds.some(id => interaction.member.roles.cache.has(id));
          const isManager = interaction.memberPermissions?.has(PermissionFlagsBits.ManageChannels);

          if (!isSupport && !isManager) {
            return interaction.reply({
              embeds: [err("Yetkin yok", "Bu bileti yalnızca destek rollerinden biri veya kanal yönetme yetkisi olan biri üstlenebilir.")],
              flags: MessageFlags.Ephemeral
            });
          }

          if (ticket.claimedBy) {
            return interaction.reply({
              embeds: [info("Bilet zaten üstlenildi", `Bu bileti <@${ticket.claimedBy}> üstlendi.`)],
              flags: MessageFlags.Ephemeral
            });
          }

          for (const roleId of ticket.roleIds) {
            await interaction.channel.permissionOverwrites.edit(roleId, {
              ViewChannel: false,
              SendMessages: false,
              ReadMessageHistory: false
            }).catch(() => {});
          }

          await interaction.channel.permissionOverwrites.edit(ticket.ownerId, {
            ViewChannel: true,
            SendMessages: true,
            ReadMessageHistory: true,
            AttachFiles: true,
            EmbedLinks: true
          });

          await interaction.channel.permissionOverwrites.edit(interaction.user.id, {
            ViewChannel: true,
            SendMessages: true,
            ReadMessageHistory: true,
            AttachFiles: true,
            EmbedLinks: true
          });

          ticket.claimedBy = interaction.user.id;
          saveDb(db);

          const embed = new EmbedBuilder()
            .setColor("#57F287")
            .setTitle("🎯 Bilet Üstlenildi")
            .setDescription(`${interaction.user} bu bileti üstlendi.\n\n🔒 Kanal, bilet sahibi ve ilgili yetkili için kilitlendi.`)
            .setFooter({ text: "TAH Destek Sistemi" })
            .setTimestamp();

          return interaction.reply({ embeds: [embed] });
        }

        if (interaction.customId === "bilet:kapat") {
          const isOwner = ticket.ownerId === interaction.user.id;
          const isSupport = ticket.roleIds.some(id => interaction.member.roles.cache.has(id));
          const isManager = interaction.memberPermissions?.has(PermissionFlagsBits.ManageChannels);

          if (!isOwner && !isSupport && !isManager) {
            return interaction.reply({
              embeds: [err("Yetkin yok", "Bu bileti kapatma yetkiniz bulunmuyor.")],
              flags: MessageFlags.Ephemeral
            });
          }

          ticket.closed = true;
          ticket.closedAt = Date.now();
          ticket.closedBy = interaction.user.id;
          saveDb(db);

          await interaction.reply({
            embeds: [warn("Bilet kapatılıyor", "Bu kanal **5 saniye** içinde kapatılacak.")]
          });

          setTimeout(() => {
            delete db.tickets[interaction.guildId]?.[interaction.channelId];
            saveDb(db);
            interaction.channel.delete("TAH ticket kapatıldı").catch(() => {});
          }, 5000);
        }
      }

      // ---------------- Eski otomatik rol butonu ----------------
      if (interaction.isButton() && interaction.customId.startsWith("autorole:")) {
        const roleId = interaction.customId.split(":")[1];
        const role = interaction.guild.roles.cache.get(roleId);
        if (!role) return interaction.reply({ embeds: [err("Rol bulunamadı", "Paneldeki rol artık mevcut değil.")], flags: MessageFlags.Ephemeral });

        if (interaction.member.roles.cache.has(role.id)) {
          await interaction.member.roles.remove(role);
          return interaction.reply({ embeds: [ok("Rol bırakıldı", `${role} rolü kaldırıldı.`)], flags: MessageFlags.Ephemeral });
        }
        await interaction.member.roles.add(role);
        return interaction.reply({ embeds: [ok("Rol verildi", `${role} rolü verildi.`)], flags: MessageFlags.Ephemeral });
      }
    } catch (error) {
      console.error("Interaction error:", error);
      const e = err("Beklenmeyen hata", "İşlem sırasında bir hata oluştu. Konsolu kontrol et.");
      if (interaction.replied || interaction.deferred) {
        await interaction.followUp({ embeds: [e], flags: MessageFlags.Ephemeral }).catch(() => {});
      } else {
        await interaction.reply({ embeds: [e], flags: MessageFlags.Ephemeral }).catch(() => {});
      }
    }
  }
};
