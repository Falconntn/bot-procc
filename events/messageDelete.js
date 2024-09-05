const logsChannel = require("../protection-models/logsModel");
const { MessageEmbed } = require("discord.js");

module.exports = async (client, message) => {
  const logsModel = await logsChannel.findOne({
    guildId: message.guild.id,
    type: "MESSAGE_DELETE",
  });

  if (!logsModel) return;
  if (message.author.bot) return;
  const channel = message.guild.channels.cache.get(logsModel.channelId);
  if (!channel) return;

  if (message.ephemeral) return;
  if (message.embeds.length > 0) return;

  // Log the message deletion
  const { author, content, channel: deletedChannel } = message;

  const embed = new MessageEmbed()
    .setTitle("New Message Deleted!")
    .setDescription(
      `> **Message: ${content}**\n> **Sent By: <@${author.id}>**\n> **In: ${deletedChannel}**`
    )
    .setAuthor(author.username, author.displayAvatarURL())
    .setFooter(message.guild.name, message.guild.iconURL())
    .setTimestamp();

  channel.send({ embeds: [embed] });
};
