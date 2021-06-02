/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */

var pjson = require(`../package.json`);
const Discord = require(`discord.js`);

module.exports = {
	name: `info`,
	execute(client, message, args) {
		let infoEmbed = new Discord.MessageEmbed()
			.setTitle(`info`)
			.setColor(`RANDOM`)
			.addFields({
					name: `Creator`,
					value: `<@320574128568401920>`,
					inline: true
				}, {
					name: `Version`,
					value: pjson.version,
					inline: true
				})
				.setTimestamp()
				.setFooter(`${pjson.name} V${pjson.version}`, `https://i.imgur.com/YfAcgNv.png`);
		message.channel.send(infoEmbed);
	},
};