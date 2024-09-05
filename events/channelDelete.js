const logsChannel = require("../protection-models/logsModel");
const { MessageEmbed } = require("discord.js");
module.exports = async (client, channel) => {
  const logsModel = await logsChannel.findOne({
    guildId: channel.guild.id,
    type: "CHANNEL_DELETE",
  });

  if (!logsModel) return;

  const logChannel = channel.guild.channels.cache.get(logsModel.channelId);
  if (!logChannel) return;

  // Fetch audit logs
  const fetchedLogs = await channel.guild.fetchAuditLogs({
    limit: 1,
    type: "CHANNEL_DELETE",
  });

  const channelCreateLog = fetchedLogs.entries.first();
  if (!channelCreateLog) return;

  const { executor, target } = channelCreateLog;

  // Log the channel creation
  const embed = new MessageEmbed()
    .setTitle("Channel Deleted")
    .setDescription(`Channel Name: ${channel.name}`)
    .addField("Deleted By", `<@${executor.id}>`, true)
    .setAuthor(executor.username, executor.displayAvatarURL())
    .setFooter(channel.guild.name, channel.guild.iconURL())
    .setTimestamp();

  logChannel.send({ embeds: [embed] });
};
