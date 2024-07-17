const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { DB_API_URL } = require('../../config.json');

const data = new SlashCommandBuilder()
    .setName('stats')
    .setDescription('Ranked statistics for all acts')
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
    var url = (tag ? `${DB_API_URL}/valorant/stats/${ign}/${tag}` : `${DB_API_URL}/valorant/stats/${ign}`);
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
                const updatedFields = data['acts'].map(item => ({ ...item, inline: true }));
                const embed = new EmbedBuilder()
                    .setColor(0x0099FF)
                    .setTitle('Competitive Statistics for ' + data['author'])
                    .setAuthor({ name: data['author'], iconURL: data['thumbnail'], url: data['url']})
                    .addFields(updatedFields);
                await interaction.editReply({ content: "woah", embeds: [embed] });
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
