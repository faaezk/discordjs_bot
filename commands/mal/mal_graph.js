const { DB_API_URL } = require('../../config.json');
const { SlashCommandBuilder } = require('discord.js');

const data = new SlashCommandBuilder()
    .setName('mal_graph')
    .setDescription('get')
    .addStringOption(option =>
        option.setName('category')
            .setDescription('Anime or Manga')
            .setRequired(true)
            .addChoices(
                { name: 'Anime', value: 'anime' },
                { name: 'Manga', value: 'manga' }
            ))
	.addStringOption(option =>
		option.setName('title')
			.setDescription('Enter title of the anime/manga')
            .setRequired(true))  
    .addStringOption(option =>
        option.setName('type')
            .setDescription('Only required for anime')
            .setRequired(false)
            .addChoices(
                { name: 'All', value: 'all' },
                { name: 'TV', value: 'tv' },
                { name: 'Movie', value: 'movie' },
                { name: 'OVA', value: 'ova' },
                { name: 'ONA', value: 'ona' },
                { name: 'TV Special', value: 'tv_special' }
            ))

const execute = async (interaction) => {
    var category = interaction.options.getString('category');
    var title = interaction.options.getString('title');
    var type = interaction.options.getString('type');
    var url = (type ? `${DB_API_URL}/mal/graph/${category}/${type}/${title}` : `${DB_API_URL}/mal/graph/${category}/${title}`);
    var flag = true;
    var msg = "";

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
                if (category == 'anime') {
                    msg = `- Completed: ${data['completed']}\n` +
                    `- Watching: ${data['watching']}\n` +
                    `- On Hold: ${data['on_hold']}\n` +
                    `- Dropped: ${data['dropped']}\n` +
                    `- Total: ${data['total']}`;
                } else {
                    msg = `- Completed: ${data['completed']}\n` +
                    `- Reading: ${data['reading']}\n` +
                    `- On Hold: ${data['on_hold']}\n` +
                    `- Dropped: ${data['dropped']}\n` +
                    `- Total: ${data['total']}`;
                }
                
                await interaction.editReply({ content: msg, files: [data['file']] });
            }
        })

        .catch(error => {
            console.error('There was a problem with the fetch operation:', error);
        });
}

module.exports = {
	data: data,
	execute
};
