const setLevel = (ref, interaction, level) => {
  ref.child(String(interaction.guild.id)).child(String(interaction.user.id)).set({
    name: String(interaction.user.username),
    level: level
  })
}

const getLevel = async (ref, interaction) => {
  ref.child(String(interaction.guild.id)).child(String(interaction.user.id)).child("level").once("value", function(snapshot) {
    if (snapshot.val() != null) interaction.reply(String(snapshot.val()))
  })
}

module.exports = {setLevel, getLevel}