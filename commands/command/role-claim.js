const Discord = require('discord.js')
const fs = require('fs')
const reactionRolesConfig = JSON.parse(fs.readFileSync('./data/reactionroles.json','utf8'));


module.exports = {
    name: 'reactionrole',
    
    async run (client, message, args) {
        const channel = '921724947452280832'
        const Fortniterole = message.guild.roles.cache.find(role => role.id === "921724370328629258")
        const Minecraftrole = message.guild.roles.cache.find(role => role.name === "Minecraft")
        const Rainbowrole = message.guild.roles.cache.find(role => role.name === "Rainbow 6 siege")
        const Valorantrole = message.guild.roles.cache.find(role => role.name === "Valorant")
        const RocketLeaguerole = message.guild.roles.cache.find(role => role.name === "Rocket League")
        const Huntrole = message.guild.roles.cache.find(role => role.name === "Hunt Showdown")

        const FortniteEmoji = '1️⃣';
        const MinecraftEmoji =  '2️⃣';
        const RainbowEmoji = '3️⃣';
        const ValoEmoji = '4️⃣';
        const RocketEmoji = '5️⃣';
        const HuntEmoji = '6️⃣'

        let embed = new Discord.MessageEmbed()
        .setColor("#002fff")
        .setTitle('Rollen zuweisung')
        .setDescription("Wähle deine Spiele um die entsprechende Channel zu sehen.\nFalls es nicht geht, narchicht darüber benutzen\n\n" + `${FortniteEmoji} = ${Fortniterole} \n` + `${MinecraftEmoji} = ${Minecraftrole} \n` + `${RainbowEmoji} = ${Rainbowrole} \n` + `${ValoEmoji} = ${Valorantrole} \n` + `${RocketEmoji} = ${RocketLeaguerole} \n`)

        let messageEmbed = await message.channel.send(embed);
        messageEmbed.react(FortniteEmoji);
        messageEmbed.react(MinecraftEmoji);
        messageEmbed.react(RainbowEmoji);
        messageEmbed.react(ValoEmoji);
        messageEmbed.react(RocketEmoji);
        messageEmbed.react(HuntEmoji);



        client.on('messageReactionAdd', async (reaction, user) => {
            if(reaction.message.partial) await reaction.message.fetch();
            if(reaction.partial) await reaction.fetch();
            if(user.bot) return;
            if(!reaction.message.guild) return;

            if(reaction.message.channel.id == channel) {
                if(reaction.emoji.name === FortniteEmoji) {
                    await reaction.message.guild.members.cache.get(user.id).roles.add(Fortniterole)
                }
                if(reaction.emoji.name === MinecraftEmoji) {
                    await reaction.message.guild.members.cache.get(user.id).roles.add(Minecraftrole)
                }
                if(reaction.emoji.name === RainbowEmoji) {
                    await reaction.message.guild.members.cache.get(user.id).roles.add(Rainbowrole)
                }
                if(reaction.emoji.name === ValoEmoji) {
                    await reaction.message.guild.members.cache.get(user.id).roles.add(Valorantrole)
                }
                if(reaction.emoji.name === RocketEmoji) {
                    await reaction.message.guild.members.cache.get(user.id).roles.add(RocketLeaguerole)
                }
                if(reaction.emoji.name === HuntEmoji) {
                    await reaction.message.guild.members.cache.get(user.id).roles.add(Huntrole)
                }
            } else {
                return;
            }
        });

        client.on('messageReactionRemove', async (reaction, user) => {
            if(reaction.message.partial) await reaction.message.fetch();
            if(reaction.partial) await reaction.fetch();
            if(user.bot) return;
            if(!reaction.message.guild) return;

            if(reaction.message.channel.id == channel) {
                if(reaction.emoji.name === FortniteEmoji) {
                    await reaction.message.guild.members.cache.get(user.id).roles.remove(Fortniterole)
                }
                if(reaction.emoji.name === MinecraftEmoji) {
                    await reaction.message.guild.members.cache.get(user.id).roles.remove(Minecraftrole)
                }
                if(reaction.emoji.name === RainbowEmoji) {
                    await reaction.message.guild.members.cache.get(user.id).roles.remove(Rainbowrole)
                }
                if(reaction.emoji.name === ValoEmoji) {
                    await reaction.message.guild.members.cache.get(user.id).roles.remove(Valorantrole)
                }
                if(reaction.emoji.name === RocketEmoji) {
                    await reaction.message.guild.members.cache.get(user.id).roles.remove(RocketLeaguerole)
                }
                if(reaction.emoji.name === HuntEmoji) {
                    await reaction.message.guild.members.cache.get(user.id).roles.remove(HuntEmoji)
                }
            } else {
                return;
            }
        });
    }
}
