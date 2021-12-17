console.log('Loading...')

const Discord = require('discord.js')
const fs = require('fs')
const { Server } = require('http')
const client = new Discord.Client({partials: ['MESSAGE','CHANNEL','REACTION']});
const xpfile = require("./data/xp.json");
const warnFile =require("./data/warns.json");
const coinfile = require("./data/coins.json");
const reactionRolesConfig = JSON.parse(fs.readFileSync('./data/reactionroles.json','utf8'));
const serverstats = require("./data/servers.json");
const privateMessage = require('./commands/other/private.messega.js');
const { readdirSync } = require('fs');
const { join } = require('path');
const ms = require('ms');
client.commands = new Discord.Collection();
const commandsFolders = readdirSync('./commands');
const Timeout = new Discord.Collection();

const distube = require('distube');
client.distube = new distube(client, { searchSongs: false, emitNewSongOnly: true})
client.distube
.on('playSong', (message, queue, song) => message.channel.send(
  `Playing \`${song.name}\` - \`${song.formattedDuration}\`\nRequested by: ${song.user}`
))
.on('addSong', (message, queue, song) => message.channel.send(
  `Added \`${song.name}\` - \`${song.formattedDuration}\` to the queue by ${song.user}`
))


for (const folder of commandsFolders) {
  const commandFiles = readdirSync(`./commands/${folder}`).filter(file => file.endsWith('.js'));
  for (const file of commandFiles) {
    const command = require(`./commands/${folder}/${file}`);
    client.commands.set(command.name, command);
  }
}

client.on("error", console.error);

const ranks = ["Streamer",500,"VIP",50000, "Moderator",500000000, "list"];





client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
  console.log('The Bot is on ' + client.guilds.cache.size + ' servers!')
  console.log('The Bot is on ')

  const messages = [`On ${client.guilds.cache.size} servern`,'!help' , 'Version 2.2.0' , 'Musik update' , 'for Private Bot !invite' , 'join my discord server !dc'];
  let current = 1;

  client.user.setActivity(messages[0] , {type: "PLAYING"})

  setInterval(() => {
    if(messages[current]){
      client.user.setActivity(messages[current] , {type: "PLAYING"})
      current++;
    }else{
      current = 0;
      client.user.setActivity(messages[current] , {type: "PLAYING"})
    }

  }, 25*1000)

  privateMessage(client, 'ping', 'Pong!')
})


//wilkommens nachricht
client.on("guildMemberAdd", member => {
  let channel = member.guild.channels.cache.find(c => c.id === '811155700755202049')  
  if(!channel) return;
  channel.send(`${member} ist schlau,denn er/sie ist auf diesem server `)
 

  let role = member.guild.roles.cache.find(role => role.id === '781141916250406913')

  member.roles.add(role)

});

// abschieds nachricht
client.on("guildMemberRemove", member => {
  let channel = member.guild.channels.cache.find(c => c.id === '811269228857786398')
  if(!channel) return;
  channel.send(`${member} ist nicht schlau, denn er/sie hat den Sever verlassen `)

});

//wilkommens max dc
client.on("guildMemberAdd", member => {
  let channel = member.guild.channels.cache.find(c => c.id === '879713568881250314')  
  if(!channel) return;
  channel.send(`${member}, welcomme on this server  `)
 

});

// abschieds max dc
client.on("guildMemberRemove", member => {
  let channel = member.guild.channels.cache.find(c => c.id === '879713626762653708')
  if(!channel) return;
  channel.send(`bye bye ${member}`)

});

//wilkommens nachricht clan 
client.on("guildMemberAdd", member => {
  let channel = member.guild.channels.cache.find(c => c.id === '921516337166163978')  
  if(!channel) return;
  channel.send(`${member} will sich bewerben `)
 

  let role = member.guild.roles.cache.find(role => role.id === '921522092099399680')

  member.roles.add(role)

});

// abschieds max dc
client.on("guildMemberRemove", member => {
  let channel = member.guild.channels.cache.find(c => c.id === '921516897281929226')
  if(!channel) return;
  channel.send(`bye bye ${member}`)

});

client.on("message", async (message) =>{
 // private crash verhindern
  if(message.author.bot) return;
  if(!message.guild)  return message.channel.send("WARNING: You cant send my private messages!!!")

   //prefix
   if(!serverstats[message.guild.id]){
    serverstats[message.guild.id] = {
      prefix:"!"
    }
  }

  fs.writeFile("./data/servers.json", JSON.stringify(serverstats), err =>{
    if(err){
      console.log(err);
    }
  })

  let prefix =serverstats[message.guild.id].prefix

  if(!warnFile[message.author.id+message.guild.id]){
    warnFile[message.author.id+message.guild.id] = {
      warns:0,
      maxwarn:3
    }
  }

  fs.writeFile("./data/warns.json", JSON.stringify(warnFile), function(err){
    if(err) console.log(err)
  })

  //prefix ändern
  if(message.content === "prefixinfo"){
    message.channel.send("The Prefix **"+serverstats[message.guild.id].prefix+"**");
  }

  if(message.content.startsWith(prefix+"setprefix")){
    let newprefix = message.content.split(" ").slice(1).join("");

    if(!message.member.hasPermission("ADMINISTRATOR")) return message.reply("You have no rights for it!!!");
    
    serverstats[message.guild.id].prefix = newprefix;
    
    message.channel.send("The new Prefix is **"+newprefix+"**.");

    fs.writeFile("./data/servers.json", JSON.stringify(serverstats),function(err){
      if(err) console.log(err);
    })
  }


  if(message.author.bot) return;



// xp system
  if(message.author.bot) return;
  var addXP = Math.floor(Math.random() * 8) + 3;

  if(!xpfile[message.author.id+message.guild.id]){
      xpfile[message.author.id+message.guild.id] = {
        xp: 0,
        level: 1,
        reqxp: 100,

      }

      fs.writeFile("./data/xp.json", JSON.stringify(xpfile),function(err){
        if(err) console.log(err)
       })
  }

  xpfile[message.author.id+message.guild.id].xp += addXP

  if(xpfile[message.author.id+message.guild.id].xp > xpfile[message.author.id+message.guild.id].reqxp){
      xpfile[message.author.id+message.guild.id].xp -= xpfile[message.author.id+message.guild.id].reqxp // xp abziehen
      xpfile[message.author.id+message.guild.id].reqxp *= 1.25 // xp die man braucht erhöhen
      xpfile[message.author.id+message.guild.id].reqxp = Math.floor(xpfile[message.author.id+message.guild.id].reqxp) // xp runden
      xpfile[message.author.id+message.guild.id].level += 1 // 1 level hinzufügen
      
      message.reply("is now level **"+xpfile[message.author.id+message.guild.id].level+"**!")
  }

  fs.writeFile("./data/xp.json",JSON.stringify(xpfile),function(err){
    if(err) console.log[err]
  })

  if(message.content.startsWith( prefix + "level")){
    let user = message.mentions.users.first() || message.author

    let embed = new Discord.MessageEmbed()
    .setTitle("Level Karte")
    .setColor('#002fff')
    .addField("Level: " , xpfile[message.author.id+message.guild.id].level)
    .addField("XP: ", xpfile[message.author.id+message.guild.id].xp+"/"+xpfile[message.author.id+message.guild.id].reqxp)
    .addField("Xp for the next level: ", xpfile[message.author.id+message.guild.id].reqxp)
    .setFooter("Admin_Bot",client.user.avatarURL())
    message.channel.send(embed)
    console.log(message.member.user.tag + ' executed Command !level!')
  }


  //how many server
  if(message.content.startsWith(prefix+"how many server")){
    message.channel.send(`Bot is on ${client.guilds.cache.size} servern`)
  }



  if(message.content === prefix + "hallo"){
    message.channel.send("hello")
  }

  //ping command

  if(message.content === prefix + "ping"){
    message.channel.send("The Ping is "+client.ws.ping+ " ms")
    console.log(message.member.user.tag + ' executed Command !ping!')
  }

  //test und avatar command

  if(!message.member.user.bot && message.guild){
    if(message.content == '!test'){
        message.channel.send('Test!')
        console.log(message.member.user.tag + ' executed Command !test!')
    }else if(message.content.startsWith('!avatar')){
      if(message.mentions.users.first()){
        var user = message.mentions.users.first()
        var attachment = new Discord.MessageAttachment(user.avatarURL())
        message.reply(attachment)
      }else{ 
        var attachment = new Discord.MessageAttachment(user.avatarURL())
        message.reply(attachment)
        }
        console.log(!message.member.user.tag + ' executed command !avatar')
      
      }
    
 }

 //dc command
 if(!message.member.user.bot && message.guild){
  if(message.content ==  prefix + 'dc'){
    message.channel.send('This is my own Discord Server!!! https://discord.gg/HXabF7NBYx')
    console.log(message.member.user.tag + ' executed Command !dc!')
  }
 }



 //invite
 if(!message.member.user.bot && message.guild){
  if(message.content ==  prefix + 'invite'){
    message.channel.send('Thats my invite Link! https://discord.com/api/oauth2/authorize?client_id=842100212032864306&scope=bot&permissions=8')
    console.log(message.member.user.tag + ' executed Command !invite!')
  }
 }
   



    //warn system


    if(message.content.startsWith(prefix + "warn")){
      let user = message.mentions.users.first();
      let grund = message.content.split(" ").slice(2).join(" ");

      if(!user) return message.channel.send("please specify a user").then(msg=>msg.delete({timeout:5000}))

      if(!grund) grund = "no reason"

      let embed = new Discord.MessageEmbed()
      .setTitle("Warning!")
      .setDescription(`Warning <@!${user.id}>, you are warnt!\nReason: ${grund}`)
      .setColor("#002fff")
      .setFooter("Admin_Bot",client.user.avatarURL())

      message.channel.send(embed);
      

      if(!warnFile[user.id+message.guild.id]){
        warnFile[user.id+message.guild.id] = {
          warns:0,
          maxwarn:3
        }
      }

      warnFile[user.id+message.guild.id].warns += 1

      const warnEmbed = new Discord.MessageEmbed()
      .setColor('#002fff')
      .setTitle('Warning')
      .setDescription(`The user <@!${user.id}> was kicked because of too many warnings`)
      .setTimestamp()
      .setFooter("Admin_Bot",client.user.avatarURL())


      if(warnFile[user.id+message.guild.id].warns > warnFile[user.id+message.guild.id].maxwarn){
        if(message.guild.member(user).kickable == true ){
          message.channel.send(warnEmbed)
          message.guild.member(user).kick("Zu vile verwarnungen.")
        }
        delete warnFile[user.id+message.guild.id]
      }

      fs.writeFile("./data/warns.json", JSON.stringify(warnFile), function(err){
        if(err) console.log(err)
      })
  }






    // clear command

    if(message.content.startsWith(prefix + "clear")){
      if(!message.member.hasPermission("ADMINISTRATOR")) return message.reply("You have no rights for it!")
      
      let messages = message.content.split(" ").slice(1).join("");
      message.delete();

        
      if(isNaN(messages)) return  message.reply("Please enter Numbers.").then(msg=>msg.delete({timeout:5000}));
      
      

      message.channel.bulkDelete(messages);


      var embed = new Discord.MessageEmbed()
      .setColor('#002fff')
      .setTitle('Successfully')
      .setAuthor('Admin_Bot')
      .addField("Successfully " + messages + " .", "Successfully  " + messages + " messages deleted.")
      .setTimestamp()
      .setFooter("Admin_Bot",client.user.avatarURL())
  
  
      message.channel.send(embed).then(msg=>msg.delete({timeout:5000})); 
      console.log(message.member.user.tag + ' executed Command !clear')
      
    }



    //serverinfo command
    if(message.content === prefix + "serverinfo"){
      if(!message.guild) return;

      let server = {
        logo: message.guild.iconURL(),
        name: message.guild.name,
        createdaAt: message.guild.createdAt,
        id: message.guild.id,
        owner: message.guild.owner.user.username,
        region: message.guild.region,
        verified: message.guild.verified,
        members: message.guild.memberCount
        

      }
      let embed = new Discord.MessageEmbed()
      .setTitle("**ServerInfo**")
      .setColor("#002fff")
      .setThumbnail(server.logo)
      .addField("**Name**: ", server.name, true)
      .addField("**Id**: ", server.id, true)
      .addField("**Owner**: ", server.owner, true)
      .addField("**Region**: ", server.region, true)
      .addField("**Verifyd**: ", server.verified, true)
      .addField("**Member**: ", server.members, true)
      .addField("**Created on**: ", server.createdaAt,true)
      .setFooter("Admin_Bot",client.user.avatarURL())

      message.channel.send(embed)
    }


    //userrinfo command
    if(message.content === prefix + "user"){
      let user = message.mentions.users.first() || message.author

      let userinfo = {
        avatar: user.avatarURL(),
        name: user.username,
        discrim: `#${user.discriminator}`,
        id: user.id,
        status: user.presence.status,
        bot: user.bot,
        erstelltAm: user.createdAt,
        

      }
      let embed = new Discord.MessageEmbed()
      .setTitle("**User Info**")
      .setColor("#002fff")
      .setThumbnail(userinfo.avatar)
      .addField("Username: ", userinfo.name, true)
      .addField("Discriminator: ", userinfo.discriminator, true)
      .addField("ID: ", userinfo.id, true)
      .addField("Status: ", userinfo.status, true)
      .addField("Bot: ", userinfo.bot, true)
      .addField("Created on: ", userinfo.erstelltAm, true)
      .setFooter("Admin_Bot",client.user.avatarURL())
      

      message.channel.send(embed)
    }

    //say command 
    if(message.content.startsWith( prefix + "say")){
      if(!message.member.hasPermission("ADMINISTRATOR")) return message.reply("You have no rights for it!")
      var text = message.content.split(' ').slice(1).join(' ');
      message.delete();
      if(!text)return message.channel.send("Please say what to repeat i ");
      
      var embed = new Discord.MessageEmbed()
      .setTitle("Admin_Bot")
      .setColor("#002fff")
      .setDescription(text)
      .setTimestamp()
      .setFooter("Admin_Bot",client.user.avatarURL())

      message.channel.send(embed)
      
    }


    //coin system

    if(!coinfile[message.author.id+message.guild.id]){
      coinfile[message.author.id+message.guild.id] = {
        coins: 100
      }
    }

    fs.writeFile("./data/coins.json", JSON.stringify(coinfile), err =>{
      if(err){
        console.log(err); 
      }
    })
      

    if(message.content.startsWith( prefix + "flip")){

      if(!coinfile[message.author.id+message.guild.id]){
        coinfile[message.author.id+message.guild.id] = {
          coins: 100
        }
      }

      let bounty = message.content.split(" ").slice(1, 2).join("");

      let val = message.content.split(" ").slice(2, 3).join("");


      Number(bounty) // optional

      if(isNaN(bounty)) return message.reply("Please write a number for coins.You writed**"+ bounty+"**!");

      if(!bounty) return message.reply("you did not specify any coins!!!");

      if(!val) return message.reply("you havent specify **head** or **number**!");

      if(coinfile[message.author.id+message.guild.id].coins < bounty) return message.reply("you don't have enough coins!");

      coinfile[message.author.id+message.guild.id].coins -= bounty;

      let chance = Math.floor(Math.random() * 2);

      if(chance == 0){
        if(val.toLowerCase() == "head"){
            message.reply("And its..... **Head**! Your stake doubles!");

            bounty = bounty *2

            coinfile[message.author.id+message.guild.id].coins += bounty;
        
          }else{

            if(val.toLowerCase() == "number"){
              message.reply("And its..... **Head**! you lost! :( ");
            }else{
              coinfile[message.author.id+message.guild.id].coins += bounty
              message.reply("You have **Head** or **Number** misspelled!")
            }

        }
       }else{


      
          if(val.toLowerCase() == "number"){
            message.reply("And its..... **Number**! Your stake doubles!");

            bounty = bounty *2

            coinfile[message.author.id+message.guild.id].coins += bounty;
        
           }else{


              if(val.toLowerCase() == "head"){
              message.reply("And its..... **Number**! you lost :( ");
             }else{
                coinfile[message.author.id+message.guild.id].coins += bounty
                message.reply("You have **Head** or **Number** misspelled!")
            }
          
          }


        }
        

       fs.writeFile("./data/coins.json", JSON.stringify(coinfile), err =>{
        if(err){
          console.log(err);
        }

      })


    }
    
    if(message.content ===  prefix + "coins"){
      let embed = new Discord.MessageEmbed()
      .setTitle("Your coins")
      .setColor("#002fff")
      .setDescription("Coins: " + coinfile[message.author.id+message.guild.id].coins)
      .setFooter("Admin_Bot",client.user.avatarURL())

      message.channel.send(embed);

    }

   
    

    //rank system 

    if(message.content.startsWith(prefix + "buyrank")){
      let rank;
      let mrank = message.content.split(" ").slice(1).join(" "); 
      if(!mrank) return message.reply("Du hast keinen Rang zum kaufen angegeben.").then(msg=>msg.delete({timeout:5000}));

      for(var i=0;i<ranks.length;i++){
        if(isNaN(ranks[i])){
          if(mrank.toLowerCase() == ranks[i].toLowerCase()){
            rank = ranks[i];
            break;
          }
        }
      }

      if(!rank){
        return message.reply("Dieser Rank existiert nicht. Nutze !buyrank list um die lieste der Ranks zu bekommen!!!").then(msg=>msg.delete({timeout:5000}));
      }else{

          for(var i=0;i<ranks.length;i++){
            if(isNaN(ranks[i]) && ranks[i] !== "list"){
              if(rank == rank[i]){
                if(coinfile[message.author.id+message.guild.id].coins < ranks[i+1]){
                  message.reply("Du hast zu wenig Coins dafür!!!").then(msg=>msg.delete({timeout:5000}));
                  return;
                }

                let name = message.member.nickname || message.author.username;

                if(name.includes(ranks[i].toUpperCase())){
                  message.reply("Du hast diesen Rank bereits!!!").then(msg=>msg.delete({timeout:5000}));
                  return;
                }

                coinfile[message.author.id+message.guild.id].coins -= ranks[i+1];

                let coins = ranks[i+1];

                //mit rollen
                let role = message.guild.roles.cache.filter(rl=>rl.name===ranks[i])

                if(role){
                   message.member.roles.add(role).then(()=>{
                    message.channel.send(`Erfolgreich den Rang ${rank} gekauft!`).then(msg=>msg.delete({timeout:5000}));
                  }).catch(err=>{
                    if(err){
                      message.channel.send("Konnte den Rank nicht hinzufügen: "+err)
                      coinfile[message.author.id+message.guild.id].coins += coins;
                      return;
                    }
                  })
                }
              }

            }

          }

          if(rank == "list"){
            let list = "";

            for(var i=0;i<ranks.length;i++){
              if(isNaN(ranks[i]) && ranks[i] !== "list"){
                list+= `-${ranks[i]} - ${ranks[i+1]}\n\n`
              }
            }

            let embed = new Discord.MessageEmbed()
            .setTitle("Liste mit Rängen")
            .setColor("#002fff")
            .setDescription("Hier ist eine Liste mit allen Rängen:\n\n"+list)
            .setFooter("Admin_Bot",client.user.avatarURL())

            message.channel.send(embed)

            
          }

      }

      fs.writeFile("./data/coins.json", JSON.stringify(coinfile),function(err){
        if(err) console.log(err)
      })


    }


    //Ticket System frage
    if(message.content.startsWith(prefix + "createticket question")){
      let rawusername = message.author.username.split("").slice(0);
  
  
      let username = "";

      for(i=0;i<rawusername.length;i++){
        if(rawusername[i].toLowerCase() == "a"
        || rawusername[i].toLowerCase() == "b"
        || rawusername[i].toLowerCase() == "c"
        || rawusername[i].toLowerCase() == "d"
        || rawusername[i].toLowerCase() == "e"
        || rawusername[i].toLowerCase() == "f"
        || rawusername[i].toLowerCase() == "g"
        || rawusername[i].toLowerCase() == "h"
        || rawusername[i].toLowerCase() == "i"
        || rawusername[i].toLowerCase() == "j"
        || rawusername[i].toLowerCase() == "k"
        || rawusername[i].toLowerCase() == "l"
        || rawusername[i].toLowerCase() == "m"
        || rawusername[i].toLowerCase() == "n"
        || rawusername[i].toLowerCase() == "o"
        || rawusername[i].toLowerCase() == "p"
        || rawusername[i].toLowerCase() == "q"
        || rawusername[i].toLowerCase() == "r"
        || rawusername[i].toLowerCase() == "s"
        || rawusername[i].toLowerCase() == "t"
        || rawusername[i].toLowerCase() == "u"
        || rawusername[i].toLowerCase() == "v"
        || rawusername[i].toLowerCase() == "w"
        || rawusername[i].toLowerCase() == "x"
        || rawusername[i].toLowerCase() == "y"
        || rawusername[i].toLowerCase() == "z"
        || rawusername[i].toLowerCase() == "0"
        || rawusername[i].toLowerCase() == "1"
        || rawusername[i].toLowerCase() == "2"
        || rawusername[i].toLowerCase() == "3"
        || rawusername[i].toLowerCase() == "4"
        || rawusername[i].toLowerCase() == "5"
        || rawusername[i].toLowerCase() == "6"
        || rawusername[i].toLowerCase() == "7"
        || rawusername[i].toLowerCase() == "8"
        || rawusername[i].toLowerCase() == "9"){
            username+=rawusername[i].toLowerCase();
        }
    }

    if(message.channel.name !== "ticket") return message.reply("You cant create a ticket in this channel").then(msg=>msg.delete({timeout:5000}));

    message.delete();

    let category = message.guild.channels.cache.find(ct=>ct.name === "━ ︳💬︳Ticket︳💬︳━┒" && ct.type === "category");

    if(!category) await message.guild.channels.create("┖━ ︳💬︳Ticket︳💬︳━┒", {type:"category"}).then(cat=>category = cat);

    if(message.guild.channels.cache.find(cha=>cha.name===`❓ticket-${username.toLowerCase()}`)) return message.reply("you have already created a ticket!").then(msg=>msg.delete({timeout:5000}));
    
    let supporterRole = message.guild.roles.cache.find(rl=>rl.name === "Moderator")

    if(!supporterRole) return message.reply("ICh konnte keine Supporter Rolle finden").then(msg=>msg.delete({timeout:5000}));

    await message.guild.channels.create(`❓ticket-${message.author.username}`, {type:"text"}).then(ch=>{
      ch.setParent(category);
      ch.overwritePermissions([
        {
          id:message.guild.id,
          deny:["SEND_MESSAGES","VIEW_CHANNEL","ATTACH_FILES"]
        },
        {
          id:message.author.id,
          allow:["SEND_MESSAGES","VIEW_CHANNEL","ATTACH_FILES"]
        }
      ]);

      ch.send(`Hey <@&${supporterRole.id}>, a user need help!`);
    }).catch(err=>{
      if(err) return message.channel.send("Ein fehler is im System aufgetreten: "+err);
    })

    message.reply("A channel was created").then(msg=>msg.delete({timeout:9000}));
  }


  if(message.content.startsWith(prefix + "closeticket question")){
    let rawusername = message.author.username.split("").slice(0);
  
  
      let username = "";

      for(i=0;i<rawusername.length;i++){
        if(rawusername[i].toLowerCase() == "a"
        || rawusername[i].toLowerCase() == "b"
        || rawusername[i].toLowerCase() == "c"
        || rawusername[i].toLowerCase() == "d"
        || rawusername[i].toLowerCase() == "e"
        || rawusername[i].toLowerCase() == "f"
        || rawusername[i].toLowerCase() == "g"
        || rawusername[i].toLowerCase() == "h"
        || rawusername[i].toLowerCase() == "i"
        || rawusername[i].toLowerCase() == "j"
        || rawusername[i].toLowerCase() == "k"
        || rawusername[i].toLowerCase() == "l"
        || rawusername[i].toLowerCase() == "m"
        || rawusername[i].toLowerCase() == "n"
        || rawusername[i].toLowerCase() == "o"
        || rawusername[i].toLowerCase() == "p"
        || rawusername[i].toLowerCase() == "q"
        || rawusername[i].toLowerCase() == "r"
        || rawusername[i].toLowerCase() == "s"
        || rawusername[i].toLowerCase() == "t"
        || rawusername[i].toLowerCase() == "u"
        || rawusername[i].toLowerCase() == "v"
        || rawusername[i].toLowerCase() == "w"
        || rawusername[i].toLowerCase() == "x"
        || rawusername[i].toLowerCase() == "y"
        || rawusername[i].toLowerCase() == "z"
        || rawusername[i].toLowerCase() == "0"
        || rawusername[i].toLowerCase() == "1"
        || rawusername[i].toLowerCase() == "2"
        || rawusername[i].toLowerCase() == "3"
        || rawusername[i].toLowerCase() == "4"
        || rawusername[i].toLowerCase() == "5"
        || rawusername[i].toLowerCase() == "6"
        || rawusername[i].toLowerCase() == "7"
        || rawusername[i].toLowerCase() == "8"
        || rawusername[i].toLowerCase() == "9"){
            username+=rawusername[i].toLowerCase();
        }
    }

    if(!message.channel.name.includes("ticket") || message.channel.name === "ticket") return;

    if(message.channel.name !== `❓ticket-${username.toLowerCase()}` && !message.member.roles.cache.find(rl=>rl.name==="Moderator")) return message.reply("Thats not your ticket").then(msg=>msg.delete({timeout:5000}));

    await message.channel.send("Ticket closed...")

    await message.channel.delete().catch(err=>{
      if(err) return console.error("Ups es ist beim löschen des kanals ein fehler passiert")
    })
  }
  

  //Ticket System bewerbung
  if(message.content.startsWith(prefix + "createticket application")){
    let rawusername = message.author.username.split("").slice(0);


    let username = "";

    for(i=0;i<rawusername.length;i++){
      if(rawusername[i].toLowerCase() == "a"
      || rawusername[i].toLowerCase() == "b"
      || rawusername[i].toLowerCase() == "c"
      || rawusername[i].toLowerCase() == "d"
      || rawusername[i].toLowerCase() == "e"
      || rawusername[i].toLowerCase() == "f"
      || rawusername[i].toLowerCase() == "g"
      || rawusername[i].toLowerCase() == "h"
      || rawusername[i].toLowerCase() == "i"
      || rawusername[i].toLowerCase() == "j"
      || rawusername[i].toLowerCase() == "k"
      || rawusername[i].toLowerCase() == "l"
      || rawusername[i].toLowerCase() == "m"
      || rawusername[i].toLowerCase() == "n"
      || rawusername[i].toLowerCase() == "o"
      || rawusername[i].toLowerCase() == "p"
      || rawusername[i].toLowerCase() == "q"
      || rawusername[i].toLowerCase() == "r"
      || rawusername[i].toLowerCase() == "s"
      || rawusername[i].toLowerCase() == "t"
      || rawusername[i].toLowerCase() == "u"
      || rawusername[i].toLowerCase() == "v"
      || rawusername[i].toLowerCase() == "w"
      || rawusername[i].toLowerCase() == "x"
      || rawusername[i].toLowerCase() == "y"
      || rawusername[i].toLowerCase() == "z"
      || rawusername[i].toLowerCase() == "0"
      || rawusername[i].toLowerCase() == "1"
      || rawusername[i].toLowerCase() == "2"
      || rawusername[i].toLowerCase() == "3"
      || rawusername[i].toLowerCase() == "4"
      || rawusername[i].toLowerCase() == "5"
      || rawusername[i].toLowerCase() == "6"
      || rawusername[i].toLowerCase() == "7"
      || rawusername[i].toLowerCase() == "8"
      || rawusername[i].toLowerCase() == "9"){
          username+=rawusername[i].toLowerCase();
      }
  }

  if(message.channel.name !== "ticket") return message.reply("You cant create a ticket in this channel").then(msg=>msg.delete({timeout:5000}));

  message.delete();

  let category = message.guild.channels.cache.find(ct=>ct.name === "━ ︳💬︳Ticket︳💬︳━┒" && ct.type === "category");

  if(!category) await message.guild.channels.create("┖━ ︳💬︳Ticket︳💬︳━┒", {type:"category"}).then(cat=>category = cat);

  if(message.guild.channels.cache.find(cha=>cha.name===`📝ticket-${username.toLowerCase()}`)) return message.reply("You have already created a ticket!").then(msg=>msg.delete({timeout:5000}));
  
  let supporterRole = message.guild.roles.cache.find(rl=>rl.name === "Moderator")

  if(!supporterRole) return message.reply("ICh konnte keine Supporter Rolle finden").then(msg=>msg.delete({timeout:5000}));

  await message.guild.channels.create(`📝ticket-${message.author.username}`, {type:"text"}).then(ch=>{
    ch.setParent(category);
    ch.overwritePermissions([
      {
        id:message.guild.id,
        deny:["SEND_MESSAGES","VIEW_CHANNEL","ATTACH_FILES"]
      },
      {
        id:message.author.id,
        allow:["SEND_MESSAGES","VIEW_CHANNEL","ATTACH_FILES"]
      }
    ]);

    ch.send(`Hey <@&${supporterRole.id}>, a user need help!`);
  }).catch(err=>{
    if(err) return message.channel.send("Ein fehler is im System aufgetreten: "+err);
  })

  message.reply("A channel was created").then(msg=>msg.delete({timeout:9000}));
 }


 if(message.content.startsWith(prefix + "closeticket application")){
  let rawusername = message.author.username.split("").slice(0);


    let username = "";

    for(i=0;i<rawusername.length;i++){
      if(rawusername[i].toLowerCase() == "a"
      || rawusername[i].toLowerCase() == "b"
      || rawusername[i].toLowerCase() == "c"
      || rawusername[i].toLowerCase() == "d"
      || rawusername[i].toLowerCase() == "e"
      || rawusername[i].toLowerCase() == "f"
      || rawusername[i].toLowerCase() == "g"
      || rawusername[i].toLowerCase() == "h"
      || rawusername[i].toLowerCase() == "i"
      || rawusername[i].toLowerCase() == "j"
      || rawusername[i].toLowerCase() == "k"
      || rawusername[i].toLowerCase() == "l"
      || rawusername[i].toLowerCase() == "m"
      || rawusername[i].toLowerCase() == "n"
      || rawusername[i].toLowerCase() == "o"
      || rawusername[i].toLowerCase() == "p"
      || rawusername[i].toLowerCase() == "q"
      || rawusername[i].toLowerCase() == "r"
      || rawusername[i].toLowerCase() == "s"
      || rawusername[i].toLowerCase() == "t"
      || rawusername[i].toLowerCase() == "u"
      || rawusername[i].toLowerCase() == "v"
      || rawusername[i].toLowerCase() == "w"
      || rawusername[i].toLowerCase() == "x"
      || rawusername[i].toLowerCase() == "y"
      || rawusername[i].toLowerCase() == "z"
      || rawusername[i].toLowerCase() == "0"
      || rawusername[i].toLowerCase() == "1"
      || rawusername[i].toLowerCase() == "2"
      || rawusername[i].toLowerCase() == "3"
      || rawusername[i].toLowerCase() == "4"
      || rawusername[i].toLowerCase() == "5"
      || rawusername[i].toLowerCase() == "6"
      || rawusername[i].toLowerCase() == "7"
      || rawusername[i].toLowerCase() == "8"
      || rawusername[i].toLowerCase() == "9"){
          username+=rawusername[i].toLowerCase();
      }
  }

  if(!message.channel.name.includes("ticket") || message.channel.name === "ticket") return;

  if(message.channel.name !== `📝ticket-${username.toLowerCase()}` && !message.member.roles.cache.find(rl=>rl.name==="Moderator")) return message.reply("Thats not your ticket").then(msg=>msg.delete({timeout:5000}));

  await message.channel.send("Ticket closed...")

  await message.channel.delete().catch(err=>{
    if(err) return console.error("Ups es ist beim löschen des kanals ein fehler passiert")
  })
 }
 




//für den command ordner
if(message.author.bot) return;
  if(message.channel.type === 'dm') return;

  if(message.content.startsWith(prefix)) {
      {const args = message.content.slice(prefix.length).trim().split(/ +/);

      const commandName = args.shift().toLowerCase();

      const command = client.commands.get(commandName) || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));
      if(!command) return;

      if (command) {
      if (command.cooldown) {
        if(Timeout.has(`${command.name}${message.author.id}`)) return message.channel.send(`warte kurz \`${ms(Timeout.get(`${command.name}${message.author.id}`) - Date.now(), {long: true})}\` Bis du den Command noch mal ausführen darfst!!`);
        command.run(client, message, args)
        Timeout.set(`${command.name}${message.author.id}`, Date.now() + command.cooldown)
        setTimeout(() => {
          Timeout.delete(`${command.name}${message.author.id}`)
        }, command.cooldown)
      } else command.run(client, message, args);}
    }
  }
});

//Reactions Roles 
client.on('message', async (msg) => {
  if(msg.author.bot || !msg.guild) return;
  if(msg.content.startsWith('!creatReactionRole')){
    var args = msg.content.split(' ')
    if(args.length == 3){
      var emoji = args[1];
      var roleid = args[2];
      var role = msg.guild.roles.cache.get(roleid);
      if(!role){
        msg.reply('Die Rolle gibt es nicht')
        return;
      }
      var embed = new Discord.MessageEmbed()
      .setDescription(`click ${emoji} for the role => <@&${roleid}>`)
      .setColor("#002fff");

      var sendedMassage = await msg.channel.send(embed);
      sendedMassage.react(emoji)

      var toSave = {message: sendedMassage.id, emoji: emoji, role: roleid}
      reactionRolesConfig.reactions.push(toSave);

      fs.writeFileSync('data/reactionroles.json', JSON.stringify(reactionRolesConfig))
    }else {
      msg.reply('!creatReactionRole <emoji> <roleid>')
    }
  }
});

client.on("messageReactionAdd" , (reaction, user) => {
  if(reaction.message.partial) reaction.fetch();
  if(reaction.partial) reaction.fetch();
  if(user.bot || !reaction.message.guild) return;

  for (let index = 0; index < reactionRolesConfig.reactions.length; index++) {
    let reactionRole = reactionRolesConfig.reactions[index];

    if(reaction.message.id == reactionRole.message && reaction.emoji.name == reactionRole.emoji && !reaction.message.guild.members.cache.get(user.id).roles.cache.has(reactionRole.roleid)){
      reaction.message.guild.members.cache.get(user.id).roles.add(reactionRole.role)
    }
  }
})


client.on("messageReactionRemove" , (reaction, user) => {
  if(reaction.message.partial) reaction.fetch();
  if(reaction.partial) reaction.fetch();
  if(user.bot || !reaction.message.guild) return;

  for (let index = 0; index < reactionRolesConfig.reactions.length; index++) {
    let reactionRole = reactionRolesConfig.reactions[index];

    if(reaction.message.id == reactionRole.message && reaction.emoji.name == reactionRole.emoji){
      reaction.message.guild.members.cache.get(user.id).roles.remove(reactionRole.role)
    }
  }
})




client.login(process.env.token);