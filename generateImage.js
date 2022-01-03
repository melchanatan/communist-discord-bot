const Canvas = require("canvas")
const Discord = require("discord.js")

const background = "https://i.imgur.com/ImOFKfF.jpg"

const dim = {
    height: 549,
    width: 976,
    margin: 30
}

const av = {
    size: 128,
    x: dim.width / 2 - 64,
    y: dim.height / 2 - 64 - dim.height / 10
}

const generateImage = async (member) => {
    let username = member.user.username 
    let discrim = member.user.discriminator
    let avatarURL = member.user.displayAvatarURL({format: "png", dynamic: "false", size: av.size})

    const canvas = Canvas.createCanvas(dim.width, dim.height)
    const ctx = canvas.getContext("2d")

    // draw background
    const backImg = await Canvas.loadImage(background)
    ctx.drawImage(backImg, 0, 0)

    // draw black tinted box
    ctx.fillStyle = "rgba(0,0,0,0.5)"
    ctx.fillRect(dim.margin, dim.margin, dim.width - 2 * dim.margin, dim.height - 2 * dim.margin)

    const avImg = await Canvas.loadImage(avatarURL)
    ctx.save()

    ctx.beginPath()
    ctx.arc(av.x + av.size / 2, av.y + av.size / 2, av.size / 2, 0, Math.PI * 2)
    ctx.clip()

    ctx.drawImage(avImg, av.x, av.y)
    ctx.restore()

    // write in text
    ctx.fillStyle = "white"
    ctx.textAlign = "center"

    // draw in Welcome
    ctx.font = "80px MingLiU"
    ctx.fillText("欢迎", dim.width/2, dim.margin + 90)

    // draw in the username
    ctx.font = "60px Segoe UI"
    ctx.fillText(username + "#" + discrim, dim.width/2, dim.height - dim.margin - 155)

    // draw in to the server
    ctx.font = "80px MingLiU"
    ctx.fillText("到天堂", dim.width/2, dim.height - dim.margin - 60)

    const attachment = new Discord.MessageAttachment(canvas.toBuffer(), "Welcome.png")
    return attachment
}

module.exports = generateImage