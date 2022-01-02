const messages = [
    "!username! is now a Pro-Communist!",
    "!username! is here to aid our cause!",
    "Welcome, !username! you're now a Communist.",
    "Greeting comrade, !username!.",
    "Thank you for supporting our Communist regime, !username!."
]

const generateWelcomeMsg = (username) => {
    let randomNum = Math.floor(Math.random() * messages.length)
    return messages[randomNum].replace("!username!", `<@${username}>`)
}

module.exports = generateWelcomeMsg
