const logsChannel = require("../protection-models/logsModel");
const { MessageEmbed } = require("discord.js");

module.exports = async (client, oldRole, newRole) => {
  const logsModel = await logsChannel.findOne({
    guildId: newRole.guild.id,
    type: "ROLE_UPDATE",
  });

  if (!logsModel) return;

  const logChannel = newRole.guild.channels.cache.get(logsModel.channelId);
  if (!logChannel) return;

  // Fetch audit logs
  const fetchedLogs = await newRole.guild.fetchAuditLogs({
    limit: 1,
    type: "ROLE_UPDATE",
  });

  const roleUpdateLog = fetchedLogs.entries.first();
  if (!roleUpdateLog) return;

  const { executor, target } = roleUpdateLog;

  // Log the role update
  const embed = new MessageEmbed()
    .setTitle("Role Updated")
    .setDescription(`Role Name: ${newRole.name}`)
    .addField("Updated By", `<@${executor.id}>`, true)
    .addField("Old Permissions", oldRole.permissions.toArray().join(", "), true)
    .addField("New Permissions", newRole.permissions.toArray().join(", "), true)
    .setAuthor(executor.username, executor.displayAvatarURL())
    .setFooter(newRole.guild.name, newRole.guild.iconURL())
    .setTimestamp();

  if (oldRole.hexColor !== newRole.hexColor) {
    embed.addField(
      "Color Updated",
      `Old Color: ${oldRole.hexColor}\nNew Color: ${newRole.hexColor}`
    );
  }

  logChannel.send({ embeds: [embed] });
};
