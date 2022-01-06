const Discord = require("discord.js")
require("dotenv").config()
const generateImage = require("./src/generateImage")
const generateWelcomeMsg = require("./src/generateWelcomeMsg")
const addRole = require("./src/roleManager")
const {updateCredit, fetchCredit, connectFirebase} = require("./src/creditManager")

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
client.on("ready", (guild) => {
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

    // Connect to firebase 
    connectFirebase(guild.id)
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

    // Delete all role
    if (command === "del") {
        message.guild.roles.cache.forEach(roles => {
            roles.delete()
            .then(deleted => console.log(`Deleted role ${deleted.name}`))
            .catch(console.error);
        });
    }

    if (command === "add") {
        const index = parseInt(args.join())
        addRole(index, message)
    }

    if (command === "test") {
        if (updateCredit(message, 1400)) message.reply("done")
        else message.reply("ow")
    }

    if (command === "con") {
        connectFirebase(message.guildId)
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