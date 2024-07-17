const { DB_API_URL } = require('../../config.json');
const { SlashCommandBuilder } = require('discord.js');


const data = new SlashCommandBuilder()
    .setName('graph')
    .setDescription('MMR graph over time')
	.addStringOption(option =>
		option.setName('in_game_names')
			.setDescription('First part of the username (no #), separated by commas')
            .setRequired(true))
    .addStringOption(option =>
        option.setName('acts')
            .setDescription('Include act markings (individual only)')
            .setRequired(false)
            .addChoices(
                { name: 'True', value: 'true' },
                { name: 'False', value: 'false' }
            ))

const execute = async (interaction) => {
    var ign_list = interaction.options.getString('in_game_names');
    var acts = interaction.options.getString('acts');
    var url = (acts ? `${DB_API_URL}/valorant/graph/${ign_list}/${acts}` : `${DB_API_URL}/valorant/graph/${ign_list}`);
    var flag = true;

    await interaction.deferReply()
    fetch(url)
        .then(async response => {
            if (!response.ok) {
                return response.json().then(async error => {
                    flag = false;
                    await interaction.editReply({ content: error.message });
                });
                
            } else {
                return response.json();
            }
        })
        .then(async data => {
            if (flag) {
                await interaction.editReply({ content: data['content'], files: [data['file']] });
            }
        })
        .catch(error => {
            console.error('There was a problem with the fetch operation:', error);
        });
}

module.exports = {
	data: data,
	execute
}
