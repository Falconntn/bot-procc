const mongoose = require("mongoose");
const { MessageEmbed } = require("discord.js");
const trustModel = require("../../protection-models/trustModels");

module.exports = {
  name: "addtrust",
  category: "trust",
  description: "add trust users that can enable/disable the protection ",
  id: "1109436746950783095",
  options: [
    {
      name: "user",
      description: "add user to trust list",
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
        content: "The guild owner cannot add themselves as a trusted user.",
        ephemeral: true,
      });
    }

    if (user.user.bot) return;
    if (interaction.user.id !== interaction.guild.ownerId) {
      return interaction.editReply({
        content: "Only the guild owner can add trust users",
        ephemeral: true,
      });
    }

    const trusted = await trustModel.findOne({
      userId: user.id,
      guildId: interaction.guild.id,
    });
    if (trusted) {
      return interaction.editReply({
        content: `This user is already in </trustlist:1109436747135340627>`,
        allowedMentions: { repliedUser: false },
      });
    }
    const trust = await trustModel.findOne({
      userId: user.id,
      guildId: interaction.guild.id,
    });
    if (!trust) {
      const newtrust = new trustModel({
        userId: user.id,
        guildId: interaction.guild.id,
      });
      await newtrust.save();
    }
    const embed = new MessageEmbed()
      .setTitle(`New trust user`)
      .setDescription(
        `${user} has been added to </trustlist:1109436747135340627>`
      )
      .setColor("RANDOM");
    interaction.editReply({ embeds: [embed] });
  },
};
