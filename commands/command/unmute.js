const Discord = require('discord.js')

module.exports = {
    name:"unmute",

       async run (client, message, args) {
        if(!message.member.hasPermission("MUTE_MEMBERS")) return message.reply("You have no rights for it!").then(msg=>msg.delete({timeout:5000}));
       
            let role = message.guild.roles.cache.find(role => role.name === 'Muted')
            let memberrole = message.guild.roles.cache.find(role => role.name === 'Member')
            if(!memberrole) return message.reply("Please create a roll Member with big M")
            if(!role) return message.reply("Please create a roll Muted with big M")
            let member = message.mentions.members.first();
            if(!member) return message.reply("Please specify a user ")
           
            if(member.roles.cache.has(memberrole.id)) return message.reply("This user is already unmuted")
            member.roles.remove(role.id)
            member.roles.add(memberrole.id).then(()=>{
                message.channel.send(`Successfully ${member} unmuted`)
            })
        }
   }
    