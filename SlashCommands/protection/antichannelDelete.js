
const mongoose = require("mongoose");
const { MessageEmbed } = require("discord.js");
const antichannelModel = require("../../protection-models/antichannelDeleteModel");
const trustModel = require("../../protection-models/trustModels");

module.exports = {
 name: "antichannel-delete",
 category: "protection",
 description: "Toggle the antichannel-delete feature on/off",
 id: "1109436746950783086",
 options: [
  {
   name: "toggle",
   description: "antichannel-delete on/off",
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

  const antichannel = await antichannelModel.findOne({
   guildId: interaction.guild.id,
  });

  if (!antichannel) {
   const newantichannel = new antichannelModel({
    guildId: interaction.guild.id,
    onoff: toggle === "on" ? "on" : "off",
   });

   await newantichannel.save();
  } else {
   antichannel.onoff = toggle === "on" ? "on" : "off";
   await antichannel.save();
  }

  const embed = new MessageEmbed()
   .setTitle(`antichannel-delete feature for ${interaction.guild.name}`)
   .setDescription(
    `The antichannel-delete feature for ${interaction.guild.name} has been turned ${
     toggle === "on" ? "on" : "off"
    }.`
   )
   .setColor("RANDOM");


  interaction.editReply({ embeds: [embed] });
  }
 }

