const mongoose = require("mongoose");
const { MessageEmbed } = require("discord.js");
const AntilinksModel = require("../../protection-models/antilinksModel");
const trustModel = require("../../protection-models/trustModels");

module.exports = {
  name: "antilinks",
  category: "protection",
  description: "Toggle the antilinks feature on/off",
  id: "1109436746950783087",
  options: [
    {
      name: "toggle",
      description: "antilinks on/off",
      type: 3,
      required: true,
      choices: [
        {
          name: "on",
          value: "on",
        },
        {
          name: "off",
          value: "off",
        },
      ],
    },
  ],

  run: async (client, interaction, args) => {
    await interaction.deferReply({ ephemeral: true }).catch(() => {});
    const user = interaction.user;
    const toggle = interaction.options.getString("toggle").toLowerCase();

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

    const antilinks = await AntilinksModel.findOne({
      guildId: interaction.guild.id,
    });

    if (!antilinks) {
      const newAntilinks = new AntilinksModel({
        guildId: interaction.guild.id,
        onoff: toggle === "on" ? "on" : "off",
      });

      await newAntilinks.save();
    } else {
      antilinks.onoff = toggle === "on" ? "on" : "off";
      await antilinks.save();
    }

    if (antilinks && antilinks.onoff === "on") {
      const embed = new MessageEmbed()
        .setTitle(`Antilink feature for ${interaction.guild.name}`)
        .setDescription(
          `The antilinks feature for ${interaction.guild.name} is already turned on.`
        )
        .setColor("RANDOM");
      return interaction.editReply({ embeds: [embed] });
    }

    const embed = new MessageEmbed()
      .setTitle(`Antilink feature for ${interaction.guild.name}`)
      .setDescription(
        `The antilinks feature for ${interaction.guild.name} has been turned ${
          toggle === "on" ? "on" : "off"
        }.`
      )
      .setColor("RANDOM");

    interaction.editReply({ embeds: [embed] });
  },
};
