const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { DB_API_URL } = require('../../config.json');

const data = new SlashCommandBuilder()
    .setName('chairmen')
    .setDescription('Current chairmen for the rickies')

const execute = async (interaction) => {
    var flag = true;

    await interaction.deferReply()
    fetch(`${DB_API_URL}/other/connected`)
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
                const embed = new EmbedBuilder()
                .setColor(0x0099FF)
                .setTitle(data['title'])
                .setURL(data['url'])
                .setThumbnail(data['image_url'])
                .setDescription('Current chairmen for the rickies')
                .addFields(data['chairmen']);
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
