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

const addRole = (roleIndex, message) => {

    // Remove all other role from user
    ROLES.forEach( r => {
        var role = message.guild.roles.cache.find(role => role.name === r.name);
        message.member.roles.remove(role)
    })

    // Assign the role to user
    var role = message.guild.roles.cache.find(role => role.name === ROLES[roleIndex].name);
    if (!role) return
    message.member.roles.add(role);
}

module.exports = addRole