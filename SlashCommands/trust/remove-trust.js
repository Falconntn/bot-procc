const mongoose = require("mongoose");
const { MessageEmbed } = require("discord.js");
const trustModel = require("../../protection-models/trustModels");

module.exports = {
  name: "removetrust",
  category: "trust",
  description: "remove trusted user from trust list",
  id: "1109436747135340626",
  options: [
    {
      name: "user",
      description: "remove user from trust list",
      type: 6,
      required: true,
    },
  ],

  run: async (client, interaction, args) => {
    await interaction.deferReply({ ephemeral: true }).catch(() => {});
    const user = interaction.options.getMember("user");
    if (interaction.user.id !== interaction.guild.ownerId) {
      return interaction.editReply({
        content: "Only the guild owner can add trust users",
        ephemeral: true,
      });
    }
    const trusted = await trustModel.findOne({ userId: user.id });
    if (!trusted) {
      return interaction.editReply({
        content: `This user is not in </trustlist:1109436747135340627>`,
        allowedMentions: { repliedUser: false },
      });
    }
    const trust = await trustModel.findOneAndDelete({
      userId: user.id,
      guildId: interaction.guild.id,
    });
    const embed = new MessageEmbed()
      .setTitle(`New trust user`)
      .setDescription(
        `${user} has been removed from </trustlist:1109436747135340627>`
      )
      .setColor("RANDOM");
    interaction.editReply({ embeds: [embed] });
  },
};
