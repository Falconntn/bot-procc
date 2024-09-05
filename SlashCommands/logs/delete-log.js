const { MessageEmbed } = require("discord.js");
const logsChannel = require("../../protection-models/logsModel");

module.exports = {
  name: "deletelog",
  category: "logs",
  description: "delete the logs channel",
  id: "1109436746774618198",
  options: [
    {
      name: "channel",
      description: "remove log channel",
      type: 7,
      required: true,
    },
  ],
  run: async (client, interaction, args) => {
    await interaction.deferReply({ ephemeral: true }).catch(() => {});
    const channel = interaction.options.getChannel("channel");
    const logsModel = await logsChannel.findOneAndDelete({
      guildId: interaction.guild.id,
    });

    if (!logsModel) {
      return interaction.editReply({
        content: "The logs channel was not set.",
      });
    }

    const embed = new MessageEmbed().setDescription(
      `${channel} has been remove to be logs channel.`
    );
    interaction.editReply({ embeds: [embed] });
  },
};
