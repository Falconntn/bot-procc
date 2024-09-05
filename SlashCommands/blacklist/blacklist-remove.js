const mongoose = require("mongoose");
const { MessageEmbed } = require("discord.js");
const blacklistModel = require("../../protection-models/blacklistModel");
const ms = require("ms");

module.exports = {
  name: "blacklistremove",
  category: "blacklist",
  description: "Remove user from blacklist",
  id: "1109436746774618197",
  options: [
    {
      name: "user",
      description: "Remove user from blacklist",
      type: 6,
      required: true,
    },
  ],

  run: async (client, interaction, args) => {
    await interaction.deferReply({ ephemeral: true }).catch(() => {});
    const user = interaction.options.getMember("user");
    const time = "0";

    if (interaction.user.id !== interaction.guild.ownerId) {
      return interaction.editReply({
        content: "Only the guild owner can remove trusted users",
        ephemeral: true,
      });
    }

    const blacklisted = await blacklistModel.findOne({
      userId: user.id,
      guildId: interaction.guild.id,
    });

    if (!blacklisted) {
      return interaction.editReply({
        content: `This user is not blacklisted`,
        allowedMentions: { repliedUser: false },
      });
    }

    await blacklistModel.findOneAndDelete({
      userId: user.id,
      guildId: interaction.guild.id,
    });

    const guild = interaction.guild;

    try {
      const channels = await guild.channels.fetch();

      channels.forEach(async channel => {
        if (
          channel.type !== "GUILD_CATEGORY" &&
          channel.name.includes(user.id)
        ) {
          try {
            await channel.delete();
            console.log(`Deleted channel: ${channel.name}`);
          } catch (error) {
            console.error(`Error deleting channel: ${channel.name}`);
            console.error(error);
          }
        } else {
          try {
            await channel.permissionOverwrites.edit(user, {
              VIEW_CHANNEL: null,
            });
          } catch (error) {
            console.error(
              `Error modifying channel permissions: ${channel.name}`
            );
            console.error(error);
          }
        }
      });

      const embed = new MessageEmbed()
        .setTitle(`User Removed from Blacklist`)
        .setDescription(`${user} has been removed from the blacklist.`)
        .setColor("RANDOM");

      interaction.editReply({ embeds: [embed] });

      user.send({
        content: `You have been removed from the blacklist. Any blacklist-specific channels associated with your username have been deleted.`,
      });

      user.disableCommunicationUntil(Date.now() + ms(time));
    } catch (error) {
      console.error("Error fetching channels from the guild");
      console.error(error);
    }
  },
};
