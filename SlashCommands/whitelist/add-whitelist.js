const mongoose = require("mongoose");
const { MessageEmbed } = require("discord.js");
const whitelistModel = require("../../protection-models/whitelistModels");

module.exports = {
  name: "addwhitelist",
  category: "whitelist",
  description:
    "Add a member to the whitelist so that he is not affected by protection",
  id: "1109436746950783095",
  options: [
    {
      name: "user",
      description: "add user to whitelist",
      type: 6,
      required: true,
    },
  ],

  run: async (client, interaction, args) => {
    await interaction.deferReply({ ephemeral: true }).catch(() => {});
    const user = interaction.options.getMember("user");
    if (
      interaction.user.id === interaction.guild.ownerId &&
      user.id === interaction.guild.ownerId
    ) {
      return interaction.editReply({
        content: "The guild owner cannot add themselves as a whitelisted user.",
        ephemeral: true,
      });
    }

    if (user.user.bot) return;
    if (interaction.user.id !== interaction.guild.ownerId) {
      return interaction.editReply({
        content: "Only the guild owner can add whitelist users",
        ephemeral: true,
      });
    }

    const whitelisted = await whitelistModel.findOne({
      userId: user.id,
      guildId: interaction.guild.id,
    });
    if (whitelisted) {
      return interaction.editReply({
        content: `This user is already in </whitelist:1114658268673998978>`,
        allowedMentions: { repliedUser: false },
      });
    }
    const whitelist = await whitelistModel.findOne({
      userId: user.id,
      guildId: interaction.guild.id,
    });
    if (!whitelist) {
      const newwhitelist = new whitelistModel({
        userId: user.id,
        guildId: interaction.guild.id,
      });
      await newwhitelist.save();
    }
    const embed = new MessageEmbed()
      .setTitle(`New whitlist user`)
      .setDescription(
        `${user} has been added to </whitelist:1114658268673998978>`
      )
      .setColor("RANDOM");
    interaction.editReply({ embeds: [embed] });
  },
};
