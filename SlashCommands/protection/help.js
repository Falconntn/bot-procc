const { MessageEmbed, MessageActionRow, MessageButton } = require("discord.js");

module.exports = {
  name: "help",
  category: "general",
  description: "Shows help command",
  id: "1097563898141495412",
  options: [],
  run: async (client, interaction, args) => {
    await interaction.deferReply({ ephemeral: true }).catch(() => {});
    const embed = new MessageEmbed()
      .setColor("#0099ff")
      .setTitle("Command Categories")
      .setDescription(
        `Please select a category to see the available commands.`
      );

    const row = new MessageActionRow().addComponents(
      new MessageButton()
        .setLabel("Blacklist Commands")
        .setStyle("PRIMARY")
        .setEmoji("❌")
        .setCustomId("blacklist"),
      new MessageButton()
        .setLabel("Logs Commands")
        .setStyle("PRIMARY")
        .setEmoji("🧐")
        .setCustomId("Logs"),
      new MessageButton()
        .setLabel("Protection Commands")
        .setStyle("PRIMARY")
        .setEmoji("🛡")
        .setCustomId("protection"),
      new MessageButton()
        .setLabel("Reports Commands")
        .setStyle("PRIMARY")
        .setEmoji("📝")
        .setCustomId("reports"),
      new MessageButton()
        .setLabel("Trust Commands")
        .setStyle("PRIMARY")
        .setEmoji("💪")
        .setCustomId("trust")
    );

    await interaction.editReply({ embeds: [embed], components: [row] });

    const filter = i => {
      i.deferUpdate();
      return i => i.user.id === interaction.user.id;
    };
    const collector = interaction.channel.createMessageComponentCollector({
      filter,
      time: 0,
    });

    collector.on("collect", async i => {
      const { customId } = i;
      let cmds;

      switch (customId) {
        case "blacklist":
          cmds = client.commands.filter(c => c.category === "blacklist");
          break;
        case "Logs":
          cmds = client.commands.filter(c => c.category === "logs");
          break;
        case "protection":
          cmds = client.commands.filter(c => c.category === "protection");
          break;
        case "reports":
          cmds = client.commands.filter(c => c.category === "reports");
          break;
        case "trust":
          cmds = client.commands.filter(c => c.category === "trust");
          break;
      }

      const commandList = cmds.map(
        c => `</${c.name}:${c.id}> :: ${c.description}\n`
      );
      const embed = new MessageEmbed()
        .setColor("#0099ff")
        .setTitle(`${customId} Commands`)
        .setDescription(commandList.join(""));
      await interaction.editReply({ embeds: [embed] });
    });
  },
};
