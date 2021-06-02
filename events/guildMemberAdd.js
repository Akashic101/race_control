/* eslint-disable no-undef */

var pjson = require(`../package.json`);
const Discord = require(`discord.js`);
const Sequelize = require('sequelize');

const sequelize = new Sequelize('database', 'user', 'password', {
	host: 'localhost',
	dialect: 'sqlite',
	logging: false,
	// SQLite only
	storage: 'driver_info.sqlite',
});

const driver_info = sequelize.define('driver_info', {
	user_id: {
		type: Sequelize.BIGINT,
		unique: true
	},
	ACC: {
		type: Sequelize.BOOLEAN,
		defaultValue: false
	},
	RF2: {
		type: Sequelize.BOOLEAN,
		defaultValue: false
	},
	AMS2: {
		type: Sequelize.BOOLEAN,
		defaultValue: false
	},
});

driver_info.sync();

module.exports = async (client, message, member) => {

	try {
		const user = await driver_info.create({
			user_id: member.id
		})
	} catch (e) {
		if (e.name === 'SequelizeUniqueConstraintError') {
			return message.reply('That tag already exists.');
		}
		return message.reply('Something went wrong with adding a tag.');
	}

	let infoEmbed = new Discord.MessageEmbed()
		.setTitle(`Hello`)
		.setDescription(`Good to have you with us <@${member.id}>. Please react to this message with the emote of the game you are interested in`)
		.addFields({
			name: `Assetto Corsa Competizione`,
			value: `🏎️`,
			inline: true
		}, {
			name: `Rfactor 2`,
			value: `🚗`,
			inline: true
		}, {
			name: `Automobilista 2`,
			value: `🚓`,
			inline: true
		})
		.setTimestamp()
		.setFooter(`${pjson.name} V${pjson.version}`, `https://i.imgur.com/YfAcgNv.png`);
	message.channel.send(infoEmbed).then(infoEmbed => {
		try {
			infoEmbed.react(`🏎️`);
			infoEmbed.react(`🚗`);
			infoEmbed.react(`🚓`);
		} catch (error) {
			console.error('One of the emojis failed to react:', error);
		}

		const filter = (reaction, user) => {
			return reaction.emoji.name === '🏎️' || reaction.emoji.name === '🚗' || reaction.emoji.name === '🚓' && user.id === message.author.id
		};

		const collector = infoEmbed.createReactionCollector(filter, {
			time: 15000
		});

		collector.on('collect', async (reaction, user) => {

			if (user.tag != `Race-Control#4354`) {
				switch (reaction.emoji.name) {
					case `🏎️`:
						await driver_info.update({
							ACC: true
						}, {
							where: {
								user_id: user.id
							}
						});
						break;
					case `🚗`:
						await driver_info.update({
							RF2: true
						}, {
							where: {
								user_id: user.id
							}
						});
						break;
					case `🚓`:
						await driver_info.update({
							AMS2: true
						}, {
							where: {
								user_id: user.id
							}
						});
						break;
					default:
						break;
				}
			}
		});
	});
};