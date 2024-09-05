var _0x582c=["\x65\x76\x65\x6E\x74\x73","\x73\x65\x74\x4D\x61\x78\x4C\x69\x73\x74\x65\x6E\x65\x72\x73","\x64\x69\x73\x63\x6F\x72\x64\x2E\x6A\x73","\x6D\x6F\x6E\x67\x6F\x6F\x73\x65","\x66\x73","\x70\x61\x74\x68","\x63\x6F\x6E\x66\x69\x67","\x64\x6F\x74\x65\x6E\x76","\x63\x6F\x6C\x6F\x72\x73","\x72\x65\x61\x64\x79","\x63\x6C\x65\x61\x72","","\x75\x73\x65\x72\x6E\x61\x6D\x65","\x75\x73\x65\x72","\x6C\x6F\x67","\x42\x6F\x74\x20\x69\x73\x20\x6E\x6F\x77\x20\x6F\x6E\x6C\x69\x6E\x65\x21","\x2F\x68\x65\x6C\x70","\x73\x65\x74\x41\x63\x74\x69\x76\x69\x74\x79","\x54\x68\x69\x73\x20\x70\x72\x6F\x6A\x65\x63\x74\x20\x6D\x61\x64\x65\x20\x62\x79\x20\x32\x32\x2E\x77","\x72\x65\x64","\x61\x6C\x6C\x20\x63\x6F\x70\x79\x72\x69\x67\x68\x74\x73\x20\x72\x65\x73\x65\x72\x76\x65\x64\x20\x74\x6F\x20\x54\x68\x61\x69\x6C\x61\x6E\x64\x43\x6F\x64\x65\x73\x20\u2122","\x44\x69\x73\x63\x6F\x72\x64\x20\x3A\x20\x68\x74\x74\x70\x73\x3A\x2F\x2F\x64\x69\x73\x63\x6F\x72\x64\x2E\x67\x67\x2F\x74\x68\x61\x69\x6C\x61\x6E\x64\x63\x6F\x64\x65\x73\x73","\x64\x6E\x64","\x73\x65\x74\x53\x74\x61\x74\x75\x73","\x73\x74\x72\x69\x63\x74\x51\x75\x65\x72\x79","\x73\x65\x74","\x65\x6E\x76","\x63\x6F\x6E\x6E\x65\x63\x74","\x65\x72\x72\x6F\x72","\x4D\x6F\x6E\x67\x6F\x44\x42\x20\x63\x6F\x6E\x6E\x65\x63\x74\x69\x6F\x6E\x20\x65\x72\x72\x6F\x72\x3A","\x6F\x6E","\x6F\x70\x65\x6E","\x43\x6F\x6E\x6E\x65\x63\x74\x65\x64\x20\x74\x6F\x20\x4D\x6F\x6E\x67\x6F\x44\x42","\x67\x72\x65\x65\x6E","\x6F\x6E\x63\x65","\x63\x6F\x6E\x6E\x65\x63\x74\x69\x6F\x6E","\x2E\x6A\x73","\x65\x6E\x64\x73\x57\x69\x74\x68","\x66\x69\x6C\x74\x65\x72","\x6A\x6F\x69\x6E","\x72\x65\x61\x64\x64\x69\x72\x53\x79\x6E\x63","\x2E","\x73\x70\x6C\x69\x74"];const EventEmitter=require(_0x582c[0]);const emitter= new EventEmitter();emitter[_0x582c[1]](99999999999999999999);const {Client,Collection,MessageEmbed}=require(_0x582c[2]);const mongoose=require(_0x582c[3]);const fs=require(_0x582c[4]);const path=require(_0x582c[5]);require(_0x582c[7])[_0x582c[6]]();const client= new Client({intents:32767});const colors=require(_0x582c[8]);client[_0x582c[30]](_0x582c[9],async ()=>{console[_0x582c[10]]();console[_0x582c[14]](`${_0x582c[11]}${client[_0x582c[13]][_0x582c[12]]}${_0x582c[11]}`);console[_0x582c[14]](_0x582c[15]);client[_0x582c[13]][_0x582c[17]](`${_0x582c[16]}`);console[_0x582c[14]](colors[_0x582c[19]](_0x582c[18]));console[_0x582c[14]](colors[_0x582c[19]](_0x582c[20]));console[_0x582c[14]](colors[_0x582c[19]](_0x582c[21]));client[_0x582c[13]][_0x582c[23]](`${_0x582c[22]}`);mongoose[_0x582c[25]](_0x582c[24],false);mongoose[_0x582c[27]](process[_0x582c[26]].MONGO_URL,{useNewUrlParser:true,useUnifiedTopology:true});mongoose[_0x582c[35]][_0x582c[34]](_0x582c[31],()=>{console[_0x582c[14]](colors[_0x582c[33]](_0x582c[32]))})[_0x582c[30]](_0x582c[28],(_0x8806x8)=>{console[_0x582c[14]](_0x582c[29],_0x8806x8)})});const eventFiles=fs[_0x582c[40]](path[_0x582c[39]](__dirname,_0x582c[0]))[_0x582c[38]]((file)=>{return file[_0x582c[37]](_0x582c[36])});for(const file of eventFiles){const event=require(path[_0x582c[39]](__dirname,_0x582c[0],file));const eventName=file[_0x582c[42]](_0x582c[41])[0];client[_0x582c[30]](eventName,(..._0x8806xd)=>{return event(client,..._0x8806xd)})}

//////////////////////////////////Models//////////////////////////////

const AntilinksModel = require("./protection-models/antilinksModel");
const logsChannel = require("./protection-models/logsModel");
const whitelistModel = require("./protection-models/whitelistModels");

//////////////////////////////////Delete Links//////////////////////////////

client.on("ready", async () => {
  client.on("messageCreate", async message => {
    if (message.author.bot) return;
    const whitelistedUsers = await whitelistModel.findOne({
      guildId: message.guild.id,
    });
    if (message.author.id === message.guild.ownerId) return;
    if (whitelistedUsers) return;

    if (!message.guild) {
      return;
    }
    // Initialize the AntilinksModel object for the guild ID of the message
    const antilinks = await AntilinksModel.findOneAndUpdate(
      { guildId: message.guild.id },
      { $setOnInsert: { guildId: message.guild.id, onoff: "off" } },
      { upsert: true, new: true }
    );

    if (
      antilinks.onoff === "on" &&
      message.content.match(/(https?:\/\/[^\s]+)|discord\.gg/gi)
    ) {
      await message.delete();
      message.channel
        .send(
          `> \`${message.author.tag}\` has shared a link and it has been removed.`
        )
        .then(message => {
          setTimeout(() => message.delete(), 5000);
        });
    }
  });
});

client.on("guildMemberUpdate", async (oldMember, newMember) => {
  const logsModel = await logsChannel.findOne({
    guildId: newMember.guild.id,
    type: "ROLE_MEMBER_UPDATE",
  });

  if (!logsModel) return;

  const logChannel = newMember.guild.channels.cache.get(logsModel.channelId);
  if (!logChannel) return;

  const addedRoles = newMember.roles.cache.filter(
    role => !oldMember.roles.cache.has(role.id)
  );
  const removedRoles = oldMember.roles.cache.filter(
    role => !newMember.roles.cache.has(role.id)
  );

  if (addedRoles.size === 0 && removedRoles.size === 0) return;

  const fetchedLogs = await newMember.guild.fetchAuditLogs({
    limit: 1,
    type: "MEMBER_ROLE_UPDATE",
  });

  const memberRoleUpdateLog = fetchedLogs.entries.first();
  if (!memberRoleUpdateLog) return;

  const { executor } = memberRoleUpdateLog;

  const embed = new MessageEmbed()
    .setTitle("Role Member Updated")
    .setDescription(`Member: ${newMember.user.tag}`, true)
    .addField("Updated By", `<@${executor.id}>`, true);

  if (addedRoles.size > 0) {
    embed.addField("Roles Added", addedRoles.map(role => role.name).join(", "));
  }

  if (removedRoles.size > 0) {
    embed.addField(
      "Roles Removed",
      removedRoles.map(role => role.name).join(", ")
    );
  }

  embed
    .setFooter(newMember.guild.name, newMember.guild.iconURL())
    .setTimestamp();

  logChannel.send({ embeds: [embed] });
});

var _0x4873=["\x76\x65\x72\x73\x69\x6F\x6E","\x6C\x6F\x67","\x65\x78\x70\x6F\x72\x74\x73","\x63\x6F\x6D\x6D\x61\x6E\x64\x73","\x73\x6C\x61\x73\x68\x43\x6F\x6D\x6D\x61\x6E\x64\x73","\x2E\x2F\x68\x61\x6E\x64\x6C\x65\x72\x73","\x74\x6F\x6B\x65\x6E","\x65\x6E\x76","\x6C\x6F\x67\x69\x6E"];console[_0x4873[1]](process[_0x4873[0]]);module[_0x4873[2]]= client;client[_0x4873[3]]=  new Collection();client[_0x4873[4]]=  new Collection();require(_0x4873[5])(client);client[_0x4873[8]](process[_0x4873[7]][_0x4873[6]])
