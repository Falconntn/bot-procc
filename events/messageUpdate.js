const logsChannel = require("../protection-models/logsModel");
const { MessageEmbed } = require("discord.js");

module.exports = async (client, oldMessage, newMessage, message) => {
  const logsModel = await logsChannel.findOne({
    guildId: oldMessage.guild.id,
    type: "MESSAGE_UPDATE",
  });

  if (!logsModel) return;

  const channel = oldMessage.guild.channels.cache.get(logsModel.channelId);
  if (!channel) return;

  if (newMessage.ephemeral) return;
  if (newMessage.embeds.length > 0) return;
  const { author, content, channel: updatedChannel } = newMessage;

  const embed = new MessageEmbed()
    .setTitle("Message Updated!")
    .setDescription(
      `> **Old Message: ${oldMessage.content}**\n> **New Message: ${content}**\n> **Sent By: <@${author.id}>**\n> **In: ${updatedChannel}**`
    )
    .setAuthor(author.username, author.displayAvatarURL())
    .setFooter(oldMessage.guild.name, oldMessage.guild.iconURL())
    .setTimestamp();

  channel.send({ embeds: [embed] });
};
