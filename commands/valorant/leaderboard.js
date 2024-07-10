const { SlashCommandBuilder } = require('discord.js');
const { DB_API_URL } = require('../../config.json');

const data = new SlashCommandBuilder()
    .setName('leaderboard')
    .setDescription('Valorant Leaderboards')
	.addStringOption(option =>
		option.setName('region')
			.setDescription('Region of the leaderboard')
			.setRequired(true)
			.addChoices(
				{ name: 'Asia Pacific', value: 'ap' },
				{ name: 'Europe', value: 'eu' },
				{ name: 'North America', value: 'na' },
				{ name: 'Local', value: 'local' },
			))

    .addStringOption(option =>
        option.setName('update')
            .setDescription('For local: Latest data vs since 12pm')
            .setRequired(false)
			.addChoices(
				{ name: 'True', value: 'true' },
				{ name: 'False', value: 'false' }
			));

const execute = async (interaction) => {
	var region = interaction.options.getString('region');
	var update = interaction.options.getString('update');
	var flag = true;

	if (update == 'true') {
		var url = `${DB_API_URL}/valorant/leaderboard/${region}/${update}`
		await interaction.reply('Please wait...')
    } else {
		var url = `${DB_API_URL}/valorant/leaderboard/${region}`
		await interaction.deferReply()
	}

	fetch(url)
		.then(response => {
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
				await interaction.editReply('```' + data['title'] + data['leaderboard'] + '```');
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
