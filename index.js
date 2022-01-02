const Discord = require("discord.js")
var admin = require("firebase-admin")
var serviceAccount = require("./communist-discord-bot.json")
require("dotenv").config()

const generateImage = require("./generateImage")

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://communist-discord-bot-337007-default-rtdb.asia-southeast1.firebasedatabase.app/"
});

var db = admin.database();
var ref = db.ref("members");
ref.once("value", function(snapshot) {
  console.log(snapshot.val());
});
//const usersRef = ref.child("members");

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
    var sp = message.content.split(" ")
    if (sp[0] == "!set" && sp[1] != null) {
        //message.channel.send(message.author.username)
        ref.child(String(message.author.id)).set({
            name: String(message.author.username),
            level: sp[1]
        })
    }
    if (sp[0] == "!level") {
        //message.channel.send(String(message.author.id));
        ref.child(String(message.author.id)).child("level").once("value", function(snapshot) {
            message.channel.send(snapshot.val())
        })
        
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