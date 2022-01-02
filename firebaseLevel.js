const setLevel = (ref, message, level) => {
  ref.child(String(message.guild.id)).child(String(message.author.id)).set({
    name: String(message.author.username),
    level: level
  })
}

const getLevel = async (ref, message) => {
  ref.child(String(message.guild.id)).child(String(message.author.id)).child("level").once("value", function(snapshot) {
    if (snapshot.val() != null) message.reply(String(snapshot.val()))
  })
}

module.exports = {setLevel, getLevel}