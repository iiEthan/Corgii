const Discord = require('discord.js');
const config = require('./config.json')
const fs = require("fs");
const bot = new Discord.Client();
bot.cChannelNum = require("./cChannelNum.json");
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
       if (bot.cChannelNum["Channel-Number"].Number == 0) {
       channelCount = channelCount + 1
       bot.cChannelNum["Channel-Number"] = {
         Number: channelCount
       }
       fs.writeFile("./cChannelNum.json", JSON.stringify(bot.cChannelNum, null, 4), err => {
         if (err) throw err;
       })
     }else{
       var _number = bot.cChannelNum["Channel-Number"].Number;
       channelCount = _number + 1
       bot.cChannelNum["Channel-Number"] = {
         Number: channelCount
       }
       fs.writeFile("./cChannelNum.json", JSON.stringify(bot.cChannelNum, null, 4), err => {
         if (err) throw err;
       })
       };

       cChannel.guild.createChannel('CORGII-' + channelCount, { type: 'voice', reason: 'CORGII channel created'})
       .then(channel => {
         let category = cChannel.parent;
         channel.setParent(category.id).then(channel => {
         channel.setPosition(1)
       })
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
