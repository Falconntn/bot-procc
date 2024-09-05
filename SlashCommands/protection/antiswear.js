const { MessageEmbed } = require("discord.js");
const antiswearModel = require("../../protection-models/antiswearModel");
const trustModel = require("../../protection-models/trustModels");

module.exports = {
  name: "antiswear",
  category: "protection",
  description: "Prevent any swear in your server",
  id : '1109436746950783090',
  options: [
    {
      name: "toggle",
      description: "toggle on / off for anti swear protection",
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
  run: async (client, interaction) => {
    await interaction.deferReply({ ephemeral: true }).catch(() => {});
    const toggle = interaction.options.getString("toggle");
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

    const antiswear = await antiswearModel.findOne({
      guildId: interaction.guild.id,
    });
    if (!antiswear) {
      const newAntiswear = new antiswearModel({
        guildId: interaction.guild.id,
        onoff: toggle === "on" ? "on" : "off",
      });
      await newAntiswear.save();
    } else {
      antiswear.onoff = toggle === "on" ? "on" : "off";
      await antiswear.save();
    }
    const embed = new MessageEmbed()
      .setTitle(`Antiswear feature for ${interaction.guild.name}`)
      .setDescription(
        `The antiswear feature for ${interaction.guild.name} has been turned ${
          toggle === "on" ? "on" : "off"
        }.\n **Note : you can add word by using** </antiswear-add:1109436746774618192>`
      );
    interaction.editReply({ embeds: [embed] });
  },
};
