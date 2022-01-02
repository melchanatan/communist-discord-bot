var admin = require("firebase-admin")
var serviceAccount = require("./communist-discord-bot.json")

const Discord = require("discord.js")
require("dotenv").config()
const generateImage = require("./generateImage")
const generateWelcomeMsg = require("./generateWelcomeMsg")
const firebase = require("./firebaseLevel")

const PREFIX = "!"
const TOKEN = process.env.TOKEN

const botJoinedImage = "https://i.imgur.com/VvgqEgw.jpg"

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://communist-discord-bot-337007-default-rtdb.asia-southeast1.firebasedatabase.app/"
});
var db = admin.database();
var ref = db.ref("members");

const client = new Discord.Client({
  intents: [
      "GUILDS",
      "GUILD_MESSAGES",
      "GUILD_MEMBERS",
  ]
})

let pinnedChannelId;
client.on("ready", () => {
    console.log(`Logged in as ${client.user.tag}`)
})
        
client.on("guildCreate", async(guild) => {
    // Set the pinned channel to the first text channel 
    const firstChannel = guild.channels.cache.find(
      (c) => c.type === "GUILD_TEXT" && c.permissionsFor(guild.me).has("SEND_MESSAGES")
    )
    pinnedChannelId = firstChannel.id

    // Bot joined message 
    firstChannel.send({
        content: "All salute, I'm here to bless everyone with the Communist wind of peace💣",
        files: [botJoinedImage]
    })
})

client.on("messageCreate", async(message) => {
    if (!message.content.startsWith(PREFIX)) return

    const args = message.content.slice(PREFIX.length).split(/ +/);
    const command = args.shift().toLocaleLowerCase();

    if (command === "set" && args[0] != null) {
        firebase.setLevel(ref, message, args[0])
    }

    if (command === "level") {
        firebase.getLevel(ref, message)
        //await message.reply(String(firebase.getLevel(ref, message)))
    }

    // Set new Pinned channel
    if (command === "pin") {
        if (pinnedChannelId == message.channelId) return message.reply("I'm already Broadcasting here, are you even paying attention 😒")

        pinnedChannelId = message.channelId
        message.reply("I will now Broadcast in this channel. Be proud👍")
    }

    // Poll command
    if (command === "poll") {
        let msg = await message.reply("‼We ARE NOT Democratic, but I will let this one pass‼\n" + args.join(" "))
        await msg.react("✅")
        await msg.react("❌")
    }

    // Random command all params are seperated by "or"
    if(command === "rand") {
        const choices = args.join(" ").split("or").map( c => c.trim())
        const randomNum = Math.floor(Math.random() * choices.length);      
        message.reply(`The Supreme Ruler had decided: ${choices[randomNum]} it is!`)
    }

})

client.on("guildMemberAdd", async (member) => {
    const img = await generateImage(member)
    const message = generateWelcomeMsg(member.id)
    member.guild.channels.cache.get(pinnedChannelId).send({
        content: message,
        files: [img]
    })
})

client.login(TOKEN)