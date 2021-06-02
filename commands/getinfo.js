/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
/* eslint-disable no-redeclare */

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

module.exports = {
	name: `getinfo`,
	async execute(client, message, args) {
		if (args.length == 0) {
			return message.reply(`Please speficy the game you want to get the driverlist for, for example "!getinfo RC2" for Rfactor 2`)
		} else {
			switch (args[0]) {
				case `ACC`:
					const drivers = await driver_info.findAll({
						where: {
							ACC: true
						}
					});
					return console.log(drivers);
				case `RF2`:
					const drivers = await driver_info.findAll({
						where: {
							RF2: true
						}
					});
					return console.log(drivers);
				case `AMS2`:
					const drivers = await driver_info.findAll({
						where: {
							game: true
						}
					});
					return console.log(drivers);
			}

			let infoEmbed = new Discord.MessageEmbed()
				.setTitle(`Driver info for ${game}`)
				.setColor(`RANDOM`)
				.setDescription()
				.setTimestamp()
				.setFooter(`${pjson.name} V${pjson.version}`, `https://i.imgur.com/YfAcgNv.png`);
			//message.channel.send(infoEmbed);
		}

	},
};