const logsChannel = require("../protection-models/logsModel");
const { MessageEmbed } = require("discord.js");
module.exports = async (client, role) => {
  const logsModel = await logsChannel.findOne({
    guildId: role.guild.id,
    type: "ROLE_CREATE",
  });

  if (!logsModel) return;

  const logChannel = role.guild.channels.cache.get(logsModel.channelId);
  if (!logChannel) return;

  // Fetch audit logs
  const fetchedLogs = await role.guild.fetchAuditLogs({
    limit: 1,
    type: "ROLE_CREATE",
  });

  const roleCreateLog = fetchedLogs.entries.first();
  if (!roleCreateLog) return;

  const { executor, target } = roleCreateLog;

  // Log the channel creation
  const embed = new MessageEmbed()
    .setTitle("Role Create")
    .setDescription(`Role Name: ${role.name}`)
    .addField("Created By", `<@${executor.id}>`, true)
    .setAuthor(executor.username, executor.displayAvatarURL())
    .setFooter(role.guild.name, role.guild.iconURL())
    .setTimestamp();

  logChannel.send({ embeds: [embed] });
};
