const mongoose = require("mongoose");
const { MessageEmbed } = require("discord.js");
const whitelistModel = require("../../protection-models/whitelistModels");

module.exports = {
  name: "removewhitelist",
  category: "whitelist",
  description: "remove a member from the whitelist",
  id: "1109436747135340626",
  options: [
    {
      name: "user",
      description: "remove user from the whitelist",
      type: 6,
      required: true,
    },
  ],

  run: async (client, interaction, args) => {
    await interaction.deferReply({ ephemeral: true }).catch(() => {});
    const user = interaction.options.getMember("user");
    if (interaction.user.id !== interaction.guild.ownerId) {
      return interaction.editReply({
        content: "Only the guild owner can remove whitelist users",
        ephemeral: true,
      });
    }
    const whitelisted = await whitelistModel.findOne({ userId: user.id });
    if (!whitelisted) {
      return interaction.editReply({
        content: `This user is not in </whitelist:1114658268673998978>`,
      });
    }
    const whitelist = await whitelistModel.findOneAndDelete({
      userId: user.id,
      guildId: interaction.guild.id,
    });
    const embed = new MessageEmbed()
      .setTitle(`Whitelist Updated`)
      .setDescription(
        `${user} has been removed from </whitelist:1114658268673998978>`
      )
      .setColor("RANDOM");
    interaction.editReply({ embeds: [embed] });
  },
};
