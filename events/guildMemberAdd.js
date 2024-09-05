const logsChannel = require("../protection-models/logsModel");
const { MessageEmbed } = require("discord.js");

module.exports = async (client, member) => {
  const logsModel = await logsChannel.findOne({
    guildId: member.guild.id,
    type: "GUILD_MEMBER_ADD",
  });

  if (!logsModel) return;

  const channel = member.guild.channels.cache.get(logsModel.channelId);
  if (!channel) return;

  // Log the member join
  const { user } = member;

  const embed = new MessageEmbed()
    .setTitle("New Member Joined!")
    .setDescription(`> **Member: <@${user.id}>**`)
    .setAuthor(user.username, user.displayAvatarURL())
    .setFooter(member.guild.name, member.guild.iconURL())
    .setTimestamp();

  channel.send({ embeds: [embed] });
};
