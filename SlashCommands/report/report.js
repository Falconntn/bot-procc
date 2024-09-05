const {
  MessageEmbed,
  TextInputComponent,
  Modal,
  MessageActionRow,
} = require("discord.js");
const reportModel = require("../../protection-models/reportchannel");

module.exports = {
  name: "report",
  category: "reports",
  description: "Submits a report to the staff's logs channel.",
  id: "1109436746950783093",
  run: async (client, interaction) => {
    const logChannel = await reportModel.findOne({
      guildId: interaction.guild.id,
    });

    const fields = {
      userID: new TextInputComponent()
        .setCustomId(`usrID`)
        .setLabel(`User ID`)
        .setStyle(`SHORT`)
        .setMaxLength(18)
        .setRequired(true),
      report: new TextInputComponent()
        .setCustomId(`report`)
        .setLabel(`Report`)
        .setStyle(`PARAGRAPH`)
        .setMaxLength(1850)
        .setMinLength(5)
        .setRequired(true),
    };

    const modal = new Modal()
      .setCustomId(`reportModal`)
      .setTitle(`Report a user`)
      .addComponents(
        new MessageActionRow().setComponents(fields.userID),
        new MessageActionRow().setComponents(fields.report)
      );

    await interaction.showModal(modal);

    const modalSubmit = await interaction
      .awaitModalSubmit({
        time: 0,
        filter: i => i.user.id === interaction.user.id,
      })
      .catch(err => {});

    await modalSubmit.deferReply({ ephemeral: true });
    if (!logChannel) {
      return modalSubmit.editReply({
        content:
          "Looks like the server doesn't have a logs channel. Please ask a staff member to set one up using </reportchannel:1109436746950783094>.",
        ephemeral: true,
      });
    }

    const log = interaction.guild.channels.cache.get(logChannel.channelId);
    if (!log || !log.isText()) {
      return modalSubmit.editReply({
        content:
          "The logs channel is invalid. Please ask a staff member to set a valid text channel using </reportchannel:1109436746950783094>.",
        ephemeral: true,
      });
    }

    if (modalSubmit) {
      let userID = modalSubmit.fields.getTextInputValue("usrID");
      let report = modalSubmit.fields.getTextInputValue("report");

      const errEmbed = new MessageEmbed().setColor("RED").setTitle("fuck you");
      let check = await client.users.fetch(userID).catch(err => {});
      if (userID === interaction.user.id) {
        return modalSubmit.editReply({ content: "You can't report yourself." });
      }
      if (!check) return modalSubmit.editReply({ embeds: [errEmbed] });
      if (check) {
        const reportEmbed = new MessageEmbed()
          .setColor("RED")
          .setTitle(":warning: New Report")
          .addFields(
            {
              name: "Submitted by:",
              value: interaction.member.user.username || "Unknown User",
            },
            { name: "Defendant:", value: `${check ?? "_ _"}` },
            { name: "Offense", value: report }
          )
          .setTimestamp();

        await log.send({ embeds: [reportEmbed] });
        modalSubmit.editReply({
          content: `<@${userID}> has been successfully reported to the server's staff.`,
          ephemeral: true,
        });
      }
    }
  },
};
