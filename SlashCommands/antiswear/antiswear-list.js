const { MessageEmbed } = require("discord.js");
const antiswearModel = require("../../protection-models/antiswearModel");

module.exports = {
  name: "antiswear-list",
  category: "antiswear",
  description: "display the list of words in the antiswear database",
  run: async (client, interaction) => {
    await interaction.deferReply({ ephemeral: true }).catch(() => {});

    const antiswear = await antiswearModel.findOne();

    if (!antiswear || antiswear.words.length === 0) {
      return interaction.editReply({
        content: "The antiswear database is empty.",
      });
    }

    const wordList = antiswear.words
      .map((word, index) => `${index + 1} - ${word}`)
      .join("\n");

    const embed = new MessageEmbed()
      .setTitle("Antiswear Word List")
      .setDescription(wordList)
      .addField(
        "Note :",
        "use </antiswear-remove:1109436746774618194> to remove any word from the list"
      );
    interaction.editReply({ embeds: [embed] });
  },
};
