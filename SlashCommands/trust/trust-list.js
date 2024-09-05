const { MessageEmbed } = require("discord.js");
const trustModel = require("../../protection-models/trustModels");

module.exports = {
  name: "trustlist",
  category: "trust",
  description: "Show the trust list in this guild",
  id: "1109436747135340627",
  run: async (client, interaction, args) => {
    await interaction.deferReply({ ephemeral: true }).catch(() => {});

    const currentPage = parseInt(interaction.options.get("page")?.value) || 1;

    const trustedusers = await trustModel.find({
      guildId: interaction.guild.id,
    });

    console.log("currentPage:", currentPage);
    console.log("trustedusers.length:", trustedusers.length);

    if (trustedusers.length === 0) {
      return interaction.editReply(`There are no trusted users available.`);
    }

    const startIndex = (currentPage - 1) * 10;
    const endIndex = startIndex + 10;
    const slicedData = trustedusers.slice(startIndex, endIndex);

    const embed = new MessageEmbed()
      .setTitle(`${interaction.guild.name} Protection`)
      .setColor("RANDOM")
      .setTimestamp()
      .setFooter(
        `Trusted Users (Page ${currentPage} / ${Math.ceil(
          trustedusers.length / 10
        )})`
      );

    let description = "";

    for (const [index, data] of slicedData.entries()) {
      const userId = data.userId;

      let userTag;

      try {
        const user = await interaction.client.users.fetch(userId);
        userTag = `${user.tag} (${userId})`;
      } catch (error) {
        userTag = `<@!${userId}> (${userId})`;
      }

      const userNumber = startIndex + index + 1;
      description += `**${userNumber} -** \`${userTag}\`\n`;
    }

    embed.setDescription(description);
    interaction.editReply({ embeds: [embed] });
  },
};
