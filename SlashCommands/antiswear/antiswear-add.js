const { MessageEmbed } = require("discord.js");
const antiswearModel = require("../../protection-models/antiswearModel");
const trustModel = require("../../protection-models/trustModels");

module.exports = {
  name: "antiswear-add",
  category: "antiswear",
  description: "add word(s) to antiswear list",
  options: [
    {
      name: "words",
      description: "word(s) to add (separated by commas)",
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

    const existingWords = await antiswearModel.findOne({
      words: { $in: wordArray },
    });
    if (existingWords) {
      const existingWordArray = existingWords.words;
      const alreadyExistingWords = wordArray.filter(word =>
        existingWordArray.includes(word)
      );

      const embed = new MessageEmbed().setDescription(
        `The following word(s) already exist in the database: ${alreadyExistingWords.join(
          ", "
        )}`
      );
      return interaction.editReply({ embeds: [embed] });
    }

    await antiswearModel.findOneAndUpdate(
      {}, // Filter to match all documents
      { $push: { words: { $each: wordArray } } }, // Add words to the array
      { upsert: true } // Create the document if it doesn't exist
    );

    const embed = new MessageEmbed().setDescription(
      `${wordArray.join(
        ", "
      )} have been added to the database.\nNote: Use </antiswear-list:1109436746774618193> to show all the words in the database.`
    );
    interaction.editReply({ embeds: [embed] });
  },
};
