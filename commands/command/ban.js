const Discord = require('discord.js')

module.exports = {
    name: "ban",
    description: "hjkhjkhh",

    async run (client, message, args) {

            if(!message.member.hasPermission("BAN_MEMBER")) return message.reply("You have no rights for it!").then(msg=>msg.delete({timeout:5000})); 
            let user = message.mentions.members.first();
            let reason = message.content.split(" ").slice(2).join(" ")
            if(!reason) reason = "no reason"
            if(!user) return message.reply("Please specify a user!").then(msg=>msg.delete({timeout:5000})); 
        
            message.guild.member(user).ban().catch(err=>{
              if(err){
                message.channel.send("I cant ban the user because he is the owner of the server!").then(msg=>msg.delete({timeout:10000})); 
              }
            })
            message.channel.send(`Successfully Banned ${user}. Reason: ${reason}`)
               
          }
    
}