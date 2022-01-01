const Discord = require("discord.js")
require("dotenv").config()

const generateImage = require("./generateImage")

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

client.on("messageCreate", (message) => {
    if (message.content == "!pin") {
        pinnedChannelId = message.channelId
    }
})

client.on("guildMemberAdd", async (member) => {
    const img = await generateImage(member)
    member.guild.channels.cache.get(pinnedChannelId).send({
        content: `<@${member.id}> is now a Communist.`,
        files: [img]
    })
})

client.login(process.env.TOKEN)