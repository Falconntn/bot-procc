const { MessageEmbed } = require("discord.js");
const blacklistModel = require("../../protection-models/blacklistModel");

module.exports = {
  name: "blacklist",
  category: "blacklist",
  description: "Show the blacklisted users in this guild",
  id : '1109436746774618196',
  run: async (client, interaction, args) => {
    await interaction.deferReply({ ephemeral: true }).catch(() => {});

    const currentPage = parseInt(interaction.options.get("page")?.value) || 1;

    const blacklistedusers = await blacklistModel.find({
      guildId: interaction.guild.id,
    });

    if (blacklistedusers.length === 0) {
      return interaction.editReply(`There are no blacklisted users available.`);
    }

    const startIndex = (currentPage - 1) * 10;
    const endIndex = startIndex + 10;
    const slicedData = blacklistedusers.slice(startIndex, endIndex);

    const embed = new MessageEmbed()
      .setTitle(`${interaction.guild.name} Protection`)
      .setColor("RANDOM")
      .setTimestamp()
      .setFooter(
        `Blacklisted Users (Page ${currentPage} / ${Math.ceil(
          blacklistedusers.length / 10
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

  embed.setDescription(description)

    interaction.editReply({ embeds: [embed] });
  },
};
