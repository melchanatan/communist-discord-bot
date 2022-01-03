const setCredit = (ref, message, Credit) => {
  ref.child(String(message.guild.id)).child(String(message.author.id)).set({
    name: String(message.author.username),
    Credit: Credit
  })
}

const getCredit = async (ref, message) => {
  ref.child(String(message.guild.id)).child(String(message.author.id)).child("Credit").once("value", function(snapshot) {
    if (snapshot.val() != null) message.reply(String(snapshot.val()))
  })
}

module.exports = {setCredit, getCredit}