var admin = require("firebase-admin")
var serviceAccount = require("./communist-discord-bot.json")
const fs = require('fs');
const {
    REST
} = require('@discordjs/rest');
const {
    Routes
} = require('discord-api-types/v9');
// Require the necessary discord.js classes
const {
    Client,
    Intents,
    Collection
} = require('discord.js');

const Discord = require("discord.js")
const generateImage = require("./generateImage")
const generateWelcomeMsg = require("./generateWelcomeMsg")
const firebase = require("./firebaseLevel")

require("dotenv").config()
const PREFIX = "!"
const TOKEN = process.env.TOKEN
const TEST_GUILD_ID = process.env.TEST_GUILD_ID

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
      Intents.FLAGS.GUILDS
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
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
const commands = [];
client.commands = new Collection();
for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    commands.push(command.data.toJSON());
    client.commands.set(command.data.name, command);
}

client.once('ready', () => {
    console.log('Ready!');
    // Registering the commands in the client
    const CLIENT_ID = client.user.id;
    const rest = new REST({
        version: '9'
    }).setToken(TOKEN);
    (async () => {
        try {
            if (!TEST_GUILD_ID) {
                await rest.put(
                    Routes.applicationCommands(CLIENT_ID), {
                        body: commands
                    },
                );
                console.log('Successfully registered application commands globally');
            } else {
                await rest.put(
                    Routes.applicationGuildCommands(CLIENT_ID, TEST_GUILD_ID), {
                        body: commands
                    },
                );
                console.log('Successfully registered application commands for development guild');
            }
        } catch (error) {
            if (error) console.error(error);
        }
    })();
});

client.on('interactionCreate', async interaction => {
    if (!interaction.isCommand()) return;
    const command = interaction.commandName

    if (command === "set" && interaction.options.getInteger('int') != null) {
        firebase.setLevel(ref, interaction, interaction.options.getInteger('int'))
        interaction.reply("ok")
    }

    if (command === "level") {
        firebase.getLevel(ref, interaction)
    }

    // Set new Pinned channel
    if (command === "pin") {
        if (pinnedChannelId == interaction.channelId) return interaction.reply("I'm already Broadcasting here, are you even paying attention 😒")

        pinnedChannelId = interaction.channelId
        interaction.reply("I will now Broadcast in this channel. Be proud👍")
    }

    // Poll command
    // if (command === "poll") {
    //     let msg = await message.reply("‼We ARE NOT Democratic, but I will let this one pass‼\n" + args.join(" "))
    //     await msg.react("✅")
    //     await msg.react("❌")
    // }

    // Random command all params are seperated by "or"
    // if(command === "rand") {
    //     const choices = args.join(" ").split("or").map( c => c.trim())
    //     const randomNum = Math.floor(Math.random() * choices.length);      
    //     interaction.reply(`The Supreme Ruler had decided: ${choices[randomNum]} it is!`)
    // }

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