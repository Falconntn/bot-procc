const mongoose = require("mongoose");
const { MessageEmbed } = require("discord.js");
const AntibotsModel = require("../../protection-models/antibotsModel");
const trustModel = require("../../protection-models/trustModels");

module.exports = {
  name: "antibots",
  category: "protection",
  description: "Toggle the antibot feature on/off",
  id: "1109436746774618200",
  options: [
    {
      name: "toggle",
      description: "antibots on/off",
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

    const antibots = await AntibotsModel.findOne({
      guildId: interaction.guild.id,
    });

    if (!antibots) {
      const newAntibots = new AntibotsModel({
        guildId: interaction.guild.id,
        onoff: toggle === "on" ? "on" : "off",
      });

      await newAntibots.save();
    } else {
      antibots.onoff = toggle === "on" ? "on" : "off";
      await antibots.save();
    }

    const embed = new MessageEmbed()
      .setTitle(`Antibot feature for ${interaction.guild.name}`)
      .setDescription(
        `The antibot feature for ${interaction.guild.name} has been turned ${
          toggle === "on" ? "on" : "off"
        }.`
      )
      .setColor("RANDOM");

    interaction.editReply({ embeds: [embed] });
  }
}