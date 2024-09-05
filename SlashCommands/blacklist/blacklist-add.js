const { MessageEmbed } = require("discord.js");
const blacklistModel = require("../../protection-models/blacklistModel");
const trustModel = require("../../protection-models/trustModels");
const ms = require("ms");

module.exports = {
  name: "blacklistadd",
  category: "blacklist",
  description: "Blacklist a user from performing any actions in the server.",
  id : '1109436746774618195',
  options: [
    {
      name: "user",
      description: "User to be blacklisted",
      type: 6,
      required: true,
    },
    {
      name: "time",
      description: "Time to be blacklisted in ms (5 seconds = 5000)",
      type: 3,
      required: false,
    },
  ],

  run: async (client, interaction) => {
    await interaction.deferReply({ ephemeral: true }).catch(() => {});
    const user = interaction.options.getMember("user");
    let time = interaction.options.getString("time");
    const trusted = await trustModel.findOne({
      userId: interaction.user.id,
      guildId: interaction.guild.id,
    });

    if (user.id === interaction.user.id) {
      return interaction.editReply({
        content: "you cant blacklist yourself",
      });
    }

    const isGuildOwner = interaction.guild.ownerId === interaction.user.id;
    if (!trusted && !isGuildOwner) {
      return interaction.editReply({
        content: "Only trusted users or the guild owner can use this command.",
      });
    }

    const blacklisted = await blacklistModel.findOne({
      userId: user.id,
      guildId: interaction.guild.id,
    });

    if (blacklisted) {
      return interaction.editReply({
        content: `${user} is already blacklisted.`,
      });
    }

    if (!time) time = "1w";

    const newBlack = new blacklistModel({
      userId: user.id,
      guildId: interaction.guild.id,
    });

    await newBlack.save();

    const embed = new MessageEmbed()
      .setTitle(`User Added to Blacklist`)
      .setDescription(`${user} has been added to the blacklist.`)
      .setColor("RANDOM");

    interaction.editReply({ embeds: [embed] });
    const guild = interaction.guild;
    const channels = guild.channels.cache;

    channels.forEach(channel => {
      if (channel.type !== "GUILD_CATEGORY") {
        channel.permissionOverwrites.create(user, {
          VIEW_CHANNEL: false,
        });
      }
    });

    const channelName = `${user}`;
    guild.channels
      .create(channelName, {
        type: "GUILD_TEXT",
        permissionOverwrites: [
          {
            id: guild.roles.everyone,
            deny: ["VIEW_CHANNEL"],
          },
          {
            id: user.id,
            allow: ["VIEW_CHANNEL"],
          },
        ],
      })
      .then(createdChannel => {
        if (createdChannel && createdChannel.type === "GUILD_TEXT") {
          const blacklistchannel = new MessageEmbed()
            .setAuthor(
              user.user.tag,
              user.user.displayAvatarURL({ dynamic: true, size: 1024 })
            )
            .setTitle("New Blacklisted User Channel")
            .addField("Blacklisted User", `${user}`)
            .addField("Blacklisted By:", `${interaction.user}`)
            .addField(
              "Unblacklisted:",
              `<t:${Math.floor((Date.now() + ms(time)) / 1000)}:R>`
            )
            .setTimestamp()
            .setFooter(
              interaction.user.tag,
              interaction.user.displayAvatarURL({ dynamic: true, size: 1024 })
            );
          createdChannel.send({ embeds: [blacklistchannel] });

          setTimeout(async () => {
            const blacklisted = await blacklistModel.findOneAndDelete({
              userId: user.id,
              guildId: interaction.guild.id,
            });
            createdChannel.delete();
            channels.forEach(channel => {
              if (channel.type !== "GUILD_CATEGORY") {
                channel.permissionOverwrites.delete(user);
              }
            });
          }, ms(time));
        }
      });

    user.send({
      content: `You have been blacklisted. You no longer have access to any channels except your personal blacklist channel. If there's any mistake, please contact <@${interaction.guild.ownerId}>.`,
    });

    user.disableCommunicationUntil(Date.now() + ms(time));
  },
};
