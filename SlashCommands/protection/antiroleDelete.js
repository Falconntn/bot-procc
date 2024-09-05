const mongoose = require("mongoose");
const { MessageEmbed } = require("discord.js");
const antiroleModel = require("../../protection-models/antiroleDeleteModel");
const trustModel = require("../../protection-models/trustModels");

module.exports = {
  name: "antirole-delete",
  category: "protection",
  description: "Toggle the antirole-delete feature on/off",
  id: "1109436746950783089",
  options: [
    {
      name: "toggle",
      description: "antirole-create on/off",
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
    const antirole = await antiroleModel.findOne({
      guildId: interaction.guild.id,
    });

    if (!antirole) {
      const newantirole = new antiroleModel({
        guildId: interaction.guild.id,
        onoff: toggle === "on" ? "on" : "off",
      });

      await newantirole.save();
    } else {
      antirole.onoff = toggle === "on" ? "on" : "off";
      await antirole.save();
    }

    const embed = new MessageEmbed()
      .setTitle(`antirole-delete feature for ${interaction.guild.name}`)
      .setDescription(
        `The antirole-delete feature for ${
          interaction.guild.name
        } has been turned ${toggle === "on" ? "on" : "off"}.`
      )
      .setColor("RANDOM");

    interaction.editReply({ embeds: [embed] });
  },
};
