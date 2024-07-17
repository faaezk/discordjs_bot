const { DB_API_URL } = require('../../config.json');
const { SlashCommandBuilder } = require('discord.js');


const data = new SlashCommandBuilder()
    .setName('banner')
    .setDescription('Shows a players banner')
	.addStringOption(option =>
		option.setName('ign')
			.setDescription('riot in-game name (first part of ign#tag)')
            .setRequired(true))
    
    .addStringOption(option =>
        option.setName('tag')
            .setDescription('riot account tag (second part of ign#tag)')
            .setRequired(false))

const execute = async (interaction) => {
    var ign = interaction.options.getString('ign');
    var tag = interaction.options.getString('tag');
    var url = (tag ? `${DB_API_URL}/valorant/banner/${ign}/${tag}` : `${DB_API_URL}/valorant/banner/${ign}`);
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
