const Discord = require('discord.js');
const config = require('./config.json')
const bot = new Discord.Client();
var channelCount = 0

bot.on('ready', () => {
 console.log(`Logged in as ${bot.user.tag}!`);
 });

 bot.on('uncaughtException', function (err) {
     console.error(err);
     console.log("Node NOT Exiting...");
 });

bot.on('voiceStateUpdate', channel => {
  let botUser = channel.guild.members.find(member => member.id === "575119998197039105")
  if (!botUser.hasPermission(['MANAGE_CHANNELS', 'MOVE_MEMBERS'])) {
      console.log("Insufficient Permissions")
      return;
    }
     let cChannel = channel.guild.channels.find(channel => channel.name === "Create Channel")

     if (cChannel.members.size > 0) {
       channelCount = channelCount + 1
       cChannel.guild.createChannel('CORGII-' + channelCount, { type: 'voice', reason: 'CORGII channel created'})
       .then(channel => {
         let category = cChannel.parent;
         channel.setParent(category.id);
       }).catch(console.error);

      }
        bot.channels.forEach((channel) => {
          if(channel.type == "voice" && channel.name.startsWith("CORGII-") && channel.members.size == 0) {
            channel.delete("Empty CORGII channel")
        }
      })
    })

bot.on('channelCreate', channel => {
  let botUser = channel.guild.members.find(member => member.id === "575119998197039105")
  if (!botUser.hasPermission(['MANAGE_CHANNELS', 'MOVE_MEMBERS'])) {
      console.log("Insufficient Permissions")
      return;
    }
  let cChannel = channel.guild.channels.find(channel => channel.name === "Create Channel")
  if (cChannel.members.size > 0) {
    cChannel.members.forEach(function(guildMember, guildMemberId) {
      guildMember.setVoiceChannel(guildMember.guild.channels.last())
    })
  }
});

bot.login(config.token);
