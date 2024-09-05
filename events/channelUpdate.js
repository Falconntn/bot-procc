const logsChannel = require("../protection-models/logsModel");
const { MessageEmbed } = require("discord.js");

module.exports = async (client, oldChannel, newChannel) => {
  const logsModel = await logsChannel.findOne({
    guildId: oldChannel.guild.id,
    type: "CHANNEL_UPDATE",
  });

  if (!logsModel) return;

  const logChannel = oldChannel.guild.channels.cache.get(logsModel.channelId);
  if (!logChannel) return;

  // Fetch audit logs
  const fetchedLogs = await oldChannel.guild.fetchAuditLogs({
    limit: 1,
    type: "CHANNEL_UPDATE",
  });

  const channelUpdateLog = fetchedLogs.entries.first();
  if (!channelUpdateLog) return;

  const { executor, target } = channelUpdateLog;

  // Log the channel update
  const embed = new MessageEmbed()
    .setTitle("Channel Updated")
    .setDescription(`> **Channel Name: ${newChannel.name}**`)
    .addField("Updated By", `<@${executor.id}>`, true)
    .setAuthor(executor.username, executor.displayAvatarURL())
    .setFooter(newChannel.guild.name, newChannel.guild.iconURL())
    .setTimestamp();

  // Compare channel properties
  if (oldChannel.name !== newChannel.name) {
    embed.addField(
      "Name",
      `Updated from: **${oldChannel.name}**\nUpdated to: **${newChannel.name}**`
    );
  }

  if (oldChannel.type !== newChannel.type) {
    embed.addField(
      "Type",
      `Updated from: ${oldChannel.type}\nUpdated to: ${newChannel.type}`
    );
  }

  if (oldChannel.topic !== newChannel.topic) {
    embed.addField(
      "Topic",
      `Updated from:\n**${oldChannel.topic || "None"}**\nUpdated to:\n**${
        newChannel.topic || "None"
      }**`
    );
  }

  // Add more comparisons for other channel properties if desired

  logChannel.send({ embeds: [embed] });
};
