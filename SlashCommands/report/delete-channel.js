const { MessageEmbed } = require("discord.js");
const reportModel = require("../../protection-models/reportchannel");
const trustModel = require("../../protection-models/trustModels");

module.exports = {
  name: "disable-report-channel",
  category: "reports",
  description: "disable report channel",
  id: "1109436746950783092",
  run: async (client, interaction, args) => {
    await interaction.deferReply({ ephemeral: true }).catch(() => {});
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
    const reportch = await reportModel.findOneAndDelete({
      guildId: interaction.guild.id,
    });

    if (!reportch) {
      return interaction.editReply({
        content: "The logs channel was not set.",
      });
    }

    const embed = new MessageEmbed().setDescription(
      `Report Logs has been disabled.`
    );
    interaction.editReply({ embeds: [embed] });
  },
};
