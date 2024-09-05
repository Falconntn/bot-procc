const { MessageEmbed, MessageActionRow, MessageButton } = require("discord.js");
const Antibots = require("../../protection-models/antibotsModel");
const antichannelCreate = require("../../protection-models/antichannelCreateModel");
const antichannelDelete = require("../../protection-models/antichannelDeleteModel");
const Antilinks = require("../../protection-models/antilinksModel");
const antiroleDeleteModel = require("../../protection-models/antiroleDeleteModel");
const antiroleCreateModel = require("../../protection-models/antiroleCreateModel");
const antiswearModel = require("../../protection-models/antiswearModel");
const logsChannel = require("../../protection-models/logsModel");
const trustModel = require("../../protection-models/trustModels");

module.exports = {
  name: "settings",
  category: "protection",
  description: "show protection settings",
  id: "1109436746950783091",
  options: [
    {
      name: "type",
      description: "log type to be set.",
      type: 3,
      required: true,
      choices: [
        {
          name: "Protection settings",
          value: "Settings",
        },
        {
          name: "Logs Settings",
          value: "logsss",
        },
      ],
    },
  ],
  run: async (client, interaction, args) => {
    await interaction.deferReply({ ephemeral: true }).catch(() => {});
    const type = interaction.options.getString("type");
    const toggle = "on" ? "on" : "off";
    const trusted = await trustModel.findOne({
      userId: interaction.user.id,
      guildId: interaction.guild.id,
    });

    const isGuildOwner = interaction.guild.ownerId === interaction.user.id;

    if (!trusted && !isGuildOwner) {
      return interaction.editReply({
        content: "Only trusted users or the guild owner can use this command.",
      });
    }

    const antibots = await Antibots.findOne({
      guildId: interaction.guild.id,
      onoff: toggle === "on" ? "on" : "off",
    });
    const antichannelC = await antichannelCreate.findOne({
      guildId: interaction.guild.id,
      onoff: toggle === "on" ? "on" : "off",
    });
    const antichannelD = await antichannelDelete.findOne({
      guildId: interaction.guild.id,
      onoff: toggle === "on" ? "on" : "off",
    });
    const antilinks = await Antilinks.findOne({
      guildId: interaction.guild.id,
      onoff: toggle === "on" ? "on" : "off",
    });
    const antiroleDelete = await antiroleDeleteModel.findOne({
      guildId: interaction.guild.id,
      onoff: toggle === "on" ? "on" : "off",
    });
    const antiroleCreate = await antiroleCreateModel.findOne({
      guildId: interaction.guild.id,
      onoff: toggle === "on" ? "on" : "off",
    });
    const antiswear = await antiswearModel.findOne({
      guildId: interaction.guild.id,
      onoff: toggle === "on" ? "on" : "off",
    });

    const logsModel = await logsChannel.findOne({
      guildId: interaction.guild.id,
    });

    let logsStatus;
    if (logsModel && logsModel.channelId) {
      const logsChannel = interaction.guild.channels.cache.get(
        logsModel.channelId
      );
      logsStatus = "</settings:1106871670607728710>";
    }

    const embed = new MessageEmbed()
      .setTitle("Protection Toggles")
      .setDescription("Here are the current protection toggles:")
      .addField(
        "AntiBots",
        `${antibots && antibots.onoff === "on" ? "✅ Enabled" : "❌ Disabled"}`
      )
      .addField(
        "AntiChannelCreate",
        `${
          antichannelC && antichannelC.onoff === "on"
            ? "✅ Enabled"
            : "❌ Disabled"
        }`
      )
      .addField(
        "AntiChannelDelete",
        `${
          antichannelD && antichannelD.onoff === "on"
            ? "✅ Enabled"
            : "❌ Disabled"
        }`
      )
      .addField(
        "AntiLinks",
        `${
          antilinks && antilinks.onoff === "on" ? "✅ Enabled" : "❌ Disabled"
        }`
      )
      .addField(
        "AntiRoleCreate",
        `${
          antiroleCreate && antiroleCreate.onoff === "on"
            ? "✅ Enabled"
            : "❌ Disabled"
        }`
      )
      .addField(
        "AntiRoleDelete",
        `${
          antiroleDelete && antiroleDelete.onoff === "on"
            ? "✅ Enabled"
            : "❌ Disabled"
        }`
      )
      .addField(
        "antiSwear",
        `${
          antiswear && antiswear.onoff === "on" ? "✅ Enabled" : "❌ Disabled"
        }`
      );

    if (type === "Settings") {
      interaction.editReply({ embeds: [embed] });
    }
    let arr = [];
    let prot = await logsChannel.find({ guildId: interaction.guild.id });

    arr = prot.map(p => {
      if (client.channels.cache.get(p.channelId) == undefined) {
        p.channelId = "Unknown";
      } else {
        p.channelId = `<#${p.channelId}>`;
      }
      return { name: p.type, value: p.channelId, inline: true };
    });

    let logschannels = new MessageEmbed();

    if (type === "logsss") {
      prot.length == 0
        ? logschannels.setDescription("فش داتا حرك ياخي ولا تزعج اهلنا")
        : logschannels.setFields(arr);
      interaction.editReply({ embeds: [logschannels] });
    }
  },
};
