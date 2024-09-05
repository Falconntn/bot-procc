const { MessageEmbed } = require("discord.js");
const antiswearModel = require("../../protection-models/antiswearModel");
const trustModel = require("../../protection-models/trustModels");

module.exports = {
  name: "antiswear-remove",
  category: "antiswear",
  description: "remove word(s) from antiswear list",
  options: [
    {
      name: "words",
      description: "word(s) to remove (separated by commas)",
      type: 3,
      required: true,
    },
  ],
  run: async (client, interaction) => {
    await interaction.deferReply({ ephemeral: true }).catch(() => {});
    const words = interaction.options.getString("words");
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

    const wordArray = words.split(",").map(word => word.trim());

    const existingWords = await antiswearModel.find({
      words: { $in: wordArray },
    });

    if (existingWords.length === 0) {
      return interaction.editReply({
        content: "These word(s) are not in the database.",
      });
    }

    await antiswearModel.findOneAndUpdate(
      {}, // Filter to match all documents
      { $pull: { words: { $in: wordArray } } } // Remove words from the array
    );

    const embed = new MessageEmbed().setDescription(
      `${wordArray.join(", ")} have been removed from the database`
    );
    interaction.editReply({ embeds: [embed] });
  },
};
