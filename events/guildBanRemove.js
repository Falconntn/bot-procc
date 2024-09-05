const logsChannel = require("../protection-models/logsModel");
const { MessageEmbed } = require("discord.js");

module.exports = async (client, member) => {
  const logsModel = await logsChannel.findOne({
    guildId: member.guild.id,
    type: "MEMBER_BAN_REMOVE",
  });

  if (!logsModel) return;

  const channel = member.guild.channels.cache.get(logsModel.channelId);
  if (!channel) return;

  // Fetch audit logs
  const fetchedLogs = await member.guild.fetchAuditLogs({
    type: "MEMBER_BAN_REMOVE",
    limit: 1,
  });

  const banLog = fetchedLogs.entries.first();
  if (!banLog) return;

  const { executor } = banLog;
  const { user, guild } = member;

  const embed = new MessageEmbed()
    .setTitle("Banned Removed")
    .setDescription(`**Member: <@${user.id}>**`)
    .addField("Removed By", `<@${executor.id}>`, true)
    .setAuthor(user.username, user.displayAvatarURL())
    .setFooter(guild.name, guild.iconURL())
    .setTimestamp();

  channel.send({ embeds: [embed] });
};
