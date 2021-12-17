const Discord = require('discord.js');



module.exports = {
    name: "hasrole",

    async run (client, message, args) {
        if(!message.member.hasPermission("MANAGE_ROLES")) return message.reply("You have no rights for it!").then(msg=>msg.delete({timeout:5000})); 
        const targetUser = message.mentions.users.first()
        if(!targetUser) {
            message.reply("Please specify a user") 
            return
        }

        const roleName =  message.content.split(" ").slice(2).join(" ")
      
        const { guild } = message
        const role = guild.roles.cache.find((role) => {
            return role.name === roleName
        })
        if (!role) {
            message.reply(`There is no role with the name ${roleName}`)
            return
        }
        const member = guild.members.cache.get(targetUser.id)

        if(member.roles.cache.get(role.id)) {
            message.channel.send(`${member} has the role **${roleName}**`)
        } else {
            message.channel.send(`That user does not have the role **${roleName}**`)
        }
    },
}