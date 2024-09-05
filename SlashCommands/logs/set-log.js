const { MessageEmbed } = require("discord.js");
const logsChannel = require("../../protection-models/logsModel");
const trustModel = require("../../protection-models/trustModels");

module.exports = {
  name: "setlog",
  category: "logs",
  description: "set log channel to get all updates",
  id: "1109436746774618199",
  
  options: [
    {
      name: "type",
      description: "log type to be set.",
      type: 3,
      required: true,
      choices: [
        {
          name: "Delete Message",
          value: "MESSAGE_DELETE",
        },
        {
          name: "Update Message",
          value: "MESSAGE_UPDATE",
        },
        {
          name: "Memeber Join",
          value: "GUILD_MEMBER_ADD",
        },
        {
          name: "Memebr Leave",
          value: "GUILD_MEMBER_REMOVE",
        },
        {
          name: "Kick Memeber",
          value: "MEMBER_KICK",
        },
        {
          name: "Add Ban",
          value: "MEMBER_BAN_ADD",
        },
        {
          name: "Remove Ban",
          value: "MEMBER_BAN_REMOVE",
        },
        {
          name: "Create Channel",
          value: "CHANNEL_CREATE",
        },
        {
          name: "Delete Channel",
          value: "CHANNEL_DELETE",
        },
        {
          name: "Update Channel",
          value: "CHANNEL_UPDATE",
        },
        {
          name: "Create Role",
          value: "ROLE_CREATE",
        },
        {
          name: "Update Role",
          value: "ROLE_UPDATE",
        },
        {
          name: "Delete Role",
          value: "ROLE_DELETE",
        },
        {
          name: "Update Member Roles",
          value: "ROLE_MEMBER_UPDATE",
        },
      ],
    },
    {
      name: "channel",
      description: "set log channel",
      type: 7,
      required: true,
    },
  ],
  run: async (client, interaction, args) => {
    await interaction.deferReply({ ephemeral: true }).catch(() => {});
    const channel = interaction.options.getChannel("channel");
    const logtype = interaction.options.getString("type");

    const trusted = await trustModel.findOne({
      userId: interaction.user.id,
      guildId: interaction.guild.id,
    });

    const isGuildOwner = interaction.guild.ownerId === interaction.user.id;

    if (!trusted && !isGuildOwner) {
      return interaction.editReply({
        content: "Only trusted users or the guild owner can use this command.",
      });
    }

    if (channel.type !== "GUILD_TEXT") {
      return interaction.editReply({
        content: "Logs channel should be a TEXT channel.",
      });
    }

    const logsModel = await logsChannel.findOne({
      guildId: interaction.guild.id,
      type: logtype,
    });

    if (logsModel) {
      if (logsModel.channelId === channel.id) {
        return interaction.editReply({
          content: "This channel is already set as the logs channel.",
        });
      }

      logsModel.channelId = channel.id;
      await logsModel.save();
    } else {
      const newLogs = new logsChannel({
        channelId: channel.id,
        guildId: interaction.guild.id,
        type: logtype,
      });
      await newLogs.save();
    }

    const embed = new MessageEmbed().setDescription(
      `Logs channel has been set to ${channel} for ${logtype}.`
    );
    interaction.editReply({ embeds: [embed] });
  },
};
