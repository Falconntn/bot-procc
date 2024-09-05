const logsChannel = require("../protection-models/logsModel");
const { MessageEmbed } = require("discord.js");
module.exports = async (client, role) => {
  const logsModel = await logsChannel.findOne({
    guildId: role.guild.id,
    type: "ROLE_DELETE",
  });

  if (!logsModel) return;

  const logChannel = role.guild.channels.cache.get(logsModel.channelId);
  if (!logChannel) return;

  // Fetch audit logs
  const fetchedLogs = await role.guild.fetchAuditLogs({
    limit: 1,
    type: "ROLE_DELETE",
  });

  const roleDeleteLog = fetchedLogs.entries.first();
  if (!roleDeleteLog) return;

  const { executor, target } = roleDeleteLog;

  // Log the role deletion
  const embed = new MessageEmbed()
    .setTitle("Role Deleted")
    .setDescription(`Role Name: ${role.name}`)
    .addField("Deleted By", `<@${executor.id}>`, true)
    .setAuthor(executor.username, executor.displayAvatarURL())
    .setFooter(role.guild.name, role.guild.iconURL())
    .setTimestamp();

  logChannel.send({ embeds: [embed] });
};
