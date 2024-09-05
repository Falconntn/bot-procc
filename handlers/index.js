const { glob } = require("glob");
const { promisify } = require("util");
const { Client } = require("discord.js");

const globPromise = promisify(glob);
const { REST } = require("@discordjs/rest");
const { Routes } = require("discord-api-types/v9");
const colors = require("colors");

const { readdirSync } = require("fs");

/**
 * @param {Client} client
 */
module.exports = async client => {
  const arrayOfSlashCommands = [];
  readdirSync(`${process.cwd()}/SlashCommands`).forEach(value => {
    const directory = value;
    const slashCommands = readdirSync(
      `${process.cwd()}/SlashCommands/${value}`
    );
    slashCommands
      .filter(file => file.endsWith(".js"))
      .forEach(value => {
        const file = require(`${process.cwd()}/SlashCommands/${directory}/${value}`);

        if (file.name) {
          let everything;
          everything = {
            name: file.name,
            description: file.description,
            options: file.options,
          };
          arrayOfSlashCommands.push(everything);
          client.slashCommands.set(file.name, file);
          client.commands.set(file.name, file);
        }
      });
  });

  client.on("ready", async () => {
    //  console.log(arrayOfSlashCommands)
    const rest = new REST({ version: "9" }).setToken(process.env.token);

    (async () => {
      try {
        await rest.put(Routes.applicationCommands(client.user.id), {
          body: arrayOfSlashCommands,
        });
        console.log("[ / Commands ]: Pushed".green.bold);
      } catch (error) {
        console.error(
          `[error catched while commands putting]: ${error} `.red.bold
        );
      }
    })();

    // Register for a single guild
    // await client.guilds.cache
    //     .get("888402668098310154")
    //     .commands.set(arrayOfSlashCommands);
    // await client.application?.commands.set(arrayOfSlashCommands).then(command => console.log(`${ command.name } `))

    // client.application.commands.fetch('888187567890120775')
    //   .then(command => console.log(`Fetched command ${ command.name } `))
    //   .catch(console.error);
    // Register for all the guilds the bot is in
    // await client.application.commands.set(arrayOfSlashCommands);
  });

  client.on("interactionCreate", async interaction => {
    if (interaction.isCommand()) {
      if (interaction.guildId == null) {
        return interaction
          .editReply("This command is only available in a server")
          .catch(() => {});
      }
      const cmd = client.slashCommands.get(interaction.commandName);
      if (!cmd)
        return interaction.followUp({ content: "An error has occured " });
      const args = [];
      for (let option of interaction.options.data) {
        if (option.type === "SUB_COMMAND") {
          if (option.name) args.push(option.name);
          option.options?.forEach(x => {
            if (x.value) args.push(x.value);
          });
        } else if (option.value) args.push(option.value);
      }
      interaction.member = interaction.guild.members.cache.get(
        interaction.user.id
      );

      cmd.run(client, interaction);
    }

    if (interaction.isContextMenu()) {
      await interaction.deferReply({ ephemeral: false });
      const command = client.slashCommands.get(interaction.commandName);
      if (command) command.run(client, interaction);
    }
  });

  const AntibotsModel = require("../protection-models/antibotsModel");

  function handleGuildMemberAdd(member) {
    if (member.user.bot) {
      member
        .kick("Anti bots protection")
        .then(kickedBot => {
          const logChannel = member.guild.channels.cache.find(
            channel => channel.name === "bot-logs"
          );
          if (logChannel) {
            const kickMessage = `The bot ${kickedBot.user.tag} has been kicked from ${member.guild.name} due to Anti bots protection`;
            logChannel.send(kickMessage).catch(err => {
              console.error(err);
            });
          }
        })
        .catch(err => {
          console.error(err);
        });
    }
  }

  const antichannelDeleteModel = require("../protection-models/antichannelDeleteModel");
  const antichannelCreateModel = require("../protection-models/antichannelCreateModel");
  const antiroleCreateModel = require("../protection-models/antiroleCreateModel");
  const antiroleDeleteModel = require("../protection-models/antiroleDeleteModel");
  const antiswearModel = require("../protection-models/antiswearModel");
  const whitelistModel = require("../protection-models/whitelistModels");

  client.on("guildMemberAdd", async gg => {
    const whitelistedUsers = await whitelistModel.findOne({
      guildId: gg.guild.id,
    });
    if (whitelistedUsers) return;
    const antibots = await AntibotsModel.findOne({
      guildId: gg.guild.id,
    });

    if (!antibots) {
      const newAntibots = new AntibotsModel({
        guildId: gg.guild.id,
        onoff: antibots === "on" ? "on" : "off",
      });

      await newAntibots.save();
    }
    if (antibots && antibots?.onoff == "on") {
      handleGuildMemberAdd(gg);
    }
  });

  async function recreateChannel(channel) {
    let createdLogs = await channel.guild.fetchAuditLogs({
      type: "CHANNEL_DELETE",
      limit: 1,
    });
    const is_client = createdLogs?.entries.find(
      c => c.executorId == client.user.id
    );

    const whitelistedUsers = await whitelistModel.find({
      guildId: channel.guild.id,
    });

    const isWhitelisted =
      is_client &&
      (is_client.executor?.id === client.user.id ||
        whitelistedUsers.some(user => user.userId === is_client.executor?.id) ||
        role.guild.ownerId === is_client.executor?.id);
    if (isWhitelisted) return;

    const { name, type } = channel;
    const category = channel.parent;
    const options =
      type === "GUILD_TEXT" ? { type: "GUILD_TEXT" } : { type: "GUILD_VOICE" };

    if (is_client) return;
    const newChannel = await channel.guild.channels.create(name, {
      ...options,
      parent: category,
    });
    newChannel.send(
      "This channel was automatically recreated by the antichannel feature."
    );
    return newChannel;
  }

  client.on("channelDelete", async rc => {
    const whitelistedUsers = await whitelistModel.findOne({
      guildId: rc.guild.id,
    });
    if (whitelistedUsers) return;
    if (rc.guild.me === rc.client.user) return;
    const antichanneldelete = await antichannelDeleteModel.findOne({
      guildId: rc.guild.id,
    });

    if (!antichanneldelete) {
      const newantichanneldelete = new antichannelDeleteModel({
        guildId: rc.guild.id,
        onoff: antichanneldelete === "on" ? "on" : "off",
      });

      await newantichanneldelete.save();
    }
    if (antichanneldelete && antichanneldelete?.onoff == "on") {
      recreateChannel(rc);
    }
  });

  async function deletechannels(channel) {
    let createdLogs = await channel.guild.fetchAuditLogs({
      type: "CHANNEL_CREATE",
      limit: 1,
    });
    const whitelistedUsers = await whitelistModel.find({
      guildId: channel.guild.id,
    });

    const is_client = createdLogs?.entries.find(
      c => c.executorId == client.user.id
    );

    const isWhitelisted =
      is_client &&
      (is_client.executor?.id === client.user.id ||
        whitelistedUsers.some(user => user.userId === is_client.executor?.id) ||
        role.guild.ownerId === is_client.executor?.id);
    if (isWhitelisted) return;
    if (is_client) return;
    await channel.delete();
  }

  client.on("channelCreate", async channel => {
    const whitelistedUsers = await whitelistModel.findOne({
      guildId: channel.guild.id,
    });
    if (whitelistedUsers) return;
    const antichannel = await antichannelCreateModel.findOne({
      guildId: channel.guild.id,
    });
    if (!antichannel) {
      const newAntichannel = new antichannelCreateModel({
        guildId: channel.guild.id,
        onoff: "off",
      });
      await newAntichannel.save();
      return;
    }
    if (
      antichannel &&
      antichannel.onoff === "on" &&
      channel.type !== "category"
    ) {
      deletechannels(channel);
    }
  });

  ///////////////////////////Anti Role Delete//////////////////////////////////////
  async function recreaterole(role) {
    let createdLogs = await role.guild.fetchAuditLogs({
      type: "ROLE_DELETE",
      limit: 1,
    });

    const is_client = createdLogs?.entries.find(
      c => c.executor?.id === client.user.id
    );
    const whitelistedUsers = await whitelistModel.find({
      guildId: role.guild.id,
    });

    const isWhitelisted =
      is_client &&
      (is_client.executor?.id === client.user.id ||
        whitelistedUsers.some(user => user.userId === is_client.executor?.id) ||
        role.guild.ownerId === is_client.executor?.id);
    if (isWhitelisted) return;
    const { name, type } = role;
    const options = { type: type };

    if (is_client) return;
    const newRole = await role.guild.roles.create({
      name: role?.name,
      color: role?.color,
      hoist: role?.hoist,
      permissions: role?.permissions,
      position: role?.position,
      mentionable: role?.mentionable,
      reason: "Anti-Role",
      ...options,
    });
    return newRole;
  }

  client.on("roleDelete", async rolerc => {
    const whitelistedUsers = await whitelistModel.findOne({
      guildId: rolerc.guild.id,
    });
    if (whitelistedUsers) return;
    if (rolerc.guild.me === rolerc.client.user) return;
    const antiroledelete = await antiroleDeleteModel.findOne({
      guildId: rolerc.guild.id,
    });

    if (!antiroledelete) {
      const newantiroledelete = new antiroleDeleteModel({
        guildId: rolerc.guild.id,
        onoff: antiroledelete === "on" ? "on" : "off",
      });

      await newantiroledelete.save();
    }
    if (antiroledelete && antiroledelete?.onoff == "on") {
      recreaterole(rolerc);
    }
  });

  ///////////////////////////Anti Role Create//////////////////////////////////////
  async function deleteroles(role) {
    let createdLogs = await role.guild.fetchAuditLogs({
      type: "ROLE_CREATE",
      limit: 1,
    });
    const is_client = createdLogs?.entries.find(
      c => c.executorId == client.user.id
    );
    const whitelistedUsers = await whitelistModel.find({
      guildId: role.guild.id,
    });

    const isWhitelisted =
      is_client &&
      (is_client.executor?.id === client.user.id ||
        whitelistedUsers.some(user => user.userId === is_client.executor?.id) ||
        role.guild.ownerId === is_client.executor?.id);
    if (isWhitelisted) return;
    await role.delete();
    //const owner = await role.guild.fetchOwner();
  }

  client.on("roleCreate", async role => {
    const whitelistedUsers = await whitelistModel.findOne({
      guildId: role.guild.id,
    });
    if (whitelistedUsers) return;
    const antirole = await antiroleCreateModel.findOne({
      guildId: role.guild.id,
    });
    if (!antirole) {
      const newAntirole = new antiroleCreateModel({
        guildId: role.guild.id,
        onoff: "off",
      });
      await newAntirole.save();
      return;
    }
    if (antirole && antirole.onoff === "on") {
      deleteroles(role);
    }
  });
  ///////////////////////////Anti Swear//////////////////////////////////////
  client.on("messageCreate", async message => {
    if (!message.guild || message.author.bot) return;
    const whitelistedUsers = await whitelistModel.find({
      guildId: message.guild.id,
    });
    const isWhitelisted = whitelistedUsers.some(
      user => user.userId === message.author.id
    );
    if (isWhitelisted || message.author.id === message.guild.ownerId) return;

    const antiswear = await antiswearModel.findOne({
      guildId: message.guild.id,
    });
    if (!antiswear || antiswear.onoff !== "on") return;

    const words = antiswear.words;
    const content = message.content.toLowerCase();

    for (const word of words) {
      if (content.includes(word.toLowerCase())) {
        try {
          await message.delete();
          message.channel
            .send({
              content: `> \`${message.author.tag}\` has sent an inappropriate word and it was deleted.`,
            })
            .then(msg => {
              setTimeout(() => msg.delete(), 5000);
            });
          break;
        } catch (error) {
          console.log(`Failed to delete message: ${error}`);
        }
      }
    }
  });
};
