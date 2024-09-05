const { MessageEmbed } = require("discord.js");
const reportModel = require("../../protection-models/reportchannel");
const trustModel = require("../../protection-models/trustModels");

module.exports = {
  name: "reportchannel",
  category: "reports",
  description: "Set the report channel to log all reports",
  id: "1109436746950783094",
  options: [
    {
      name: "channel",
      description: "Channel to log all reports",
      type: 7,
      required: true,
    },
  ],
  run: async (client, interaction) => {
    await interaction.deferReply({ ephemeral: true });
    const channel = interaction.options.getChannel("channel");
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
        content: "The reports channel should be a GUILD_TEXT channel.",
      });
    }

    const reportChannel = await reportModel.findOneAndUpdate(
      { guildId: interaction.guild.id },
      { channelId: channel.id },
      { upsert: true, new: true }
    );

    const embed = new MessageEmbed().setDescription(
      `${channel} has been set as the report log channel.`
    );
    interaction.editReply({ embeds: [embed] });
  },
};
