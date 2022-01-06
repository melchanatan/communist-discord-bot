const ROLES = [{
    name: 'Very Good Boy',
    color: 'ORANGE',
},
{
    name: 'Good Boy',
    color: 'YELLOW',
},
{
    name: 'Just A Boy',
    color: 'GREEN',
},
{
    name: 'Naughty boy',
    color: 'BLUE',
},
{
    name: 'Very Naughty boy',
    color: 'RED',
},
]

const addRole = (interaction, roleIndex) => {

    // Remove all other role from user
    ROLES.forEach( r => {
        var role = interaction.guild.roles.cache.find(role => role.name === r.name);
        interaction.member.roles.remove(role)
    })

    // Assign the role to user
    var role = interaction.guild.roles.cache.find(role => role.name === ROLES[roleIndex].name);
    if (!role) return
    interaction.member.roles.add(role);
}

const createRoles = () => {
    // Create role from array of ROLES
    ROLES.forEach( role => {
        message.guild.roles.create(role)
        .then(console.log)
        .catch(console.error);
    })
}

module.exports = addRole