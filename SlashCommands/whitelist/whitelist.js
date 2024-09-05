const { MessageEmbed } = require("discord.js");
const whitelistModel = require("../../protection-models/whitelistModels");

module.exports = {
  name: "whitelist",
  category: "whitelist",
  description: "Show the whitelisted users in this guild",
  id: "1109436747135340627",
  run: async (client, interaction, args) => {
    await interaction.deferReply({ ephemeral: true }).catch(() => {});

    const currentPage = parseInt(interaction.options.get("page")?.value) || 1;

    const whitelistedusers = await whitelistModel.find({
      guildId: interaction.guild.id,
    });

    if (interaction.user.id !== interaction.guild.ownerId) {
      return interaction.editReply({
        content: "Only the guild owner can use this command",
        ephemeral: true,
      });
    }

    if (whitelistedusers.length === 0) {
      return interaction.editReply(`There are no whitelisted users available.`);
    }

    const startIndex = (currentPage - 1) * 10;
    const endIndex = startIndex + 10;
    const slicedData = whitelistedusers.slice(startIndex, endIndex);

    const embed = new MessageEmbed()
      .setTitle(`${interaction.guild.name} Protection`)
      .setColor("RANDOM")
      .setTimestamp()
      .setFooter(
        `Whitelisted Users (Page ${currentPage} / ${Math.ceil(
          whitelistedusers.length / 10
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
