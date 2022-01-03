const Discord = require("discord.js")
require("dotenv").config()
const generateImage = require("./generateImage")
const generateWelcomeMsg = require("./generateWelcomeMsg")

const PREFIX = "!"
const TOKEN = process.env.TOKEN

const botJoinedImage = "https://i.imgur.com/VvgqEgw.jpg"

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

    if(command === "test") {
        message.guild.roles.create({
            name: "avocado",
            color: "BLUE"
          })
            .then(console.log)
            .catch(console.error);
    }
})

// Send a message when new member is added to the Guild
client.on("guildMemberAdd", async (member) => {
    const img = await generateImage(member)
    const message = generateWelcomeMsg(member.id)
    member.guild.channels.cache.get(pinnedChannelId).send({
        content: message,
        files: [img]
    })
})

client.login(TOKEN)