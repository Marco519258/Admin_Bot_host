const Discord = require('discord.js');

module.exports = {
    name: "skip",
    description: "überspringt das lied",

    async run (client, message, args) {
        if(!message.member.voice.channel) return message.reply('geh in nen voic channel du schmock');

        await client.distube.skip(message)
        await message.channel.send("überspringt das lied")
    }
}