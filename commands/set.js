const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('set')
        .setDescription('set level')
        .addIntegerOption(option => option.setName('int').setDescription('Enter an integer'))
};