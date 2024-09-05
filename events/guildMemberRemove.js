const logsChannel = require("../protection-models/logsModel");
const { MessageEmbed } = require("discord.js");

module.exports = async (client, member) => {
  const logsModel = await logsChannel.findOne({
    guildId: member.guild.id,
    type: "MEMBER_KICK",
  });

  if (!logsModel) return;

  const channel = member.guild.channels.cache.get(logsModel.channelId);
  if (!channel) return;

  // Fetch audit logs
  const fetchedLogs = await member.guild.fetchAuditLogs({
    type: "MEMBER_KICK",
    limit: 1,
  });

  const kickLog = fetchedLogs.entries.first();
  if (!kickLog) return;

  const { executor, target } = kickLog;

  const embed = new MessageEmbed()
    .setTitle("New Member Kicked !")
    .setDescription(
      `> **Member : ${member.user}**\n> **Kicked By : ${executor}**`
    )
    .setAuthor({
      name: `${member.user.username}`,
      iconURL: `${member.user.displayAvatarURL()}`,
    })
    .setFooter({
      text: `${executor.username}`,
      iconURL: `${executor.displayAvatarURL()}`,
    })
    .setThumbnail(`${member.user.displayAvatarURL()}`)
    .setTimestamp();
  channel.send({ embeds: [embed] });
};
