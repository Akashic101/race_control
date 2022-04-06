/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */

var pjson = require(`../package.json`);
const Discord = require(`discord.js`);

module.exports = {
	name: `role`,
	execute(client, message, args) {
		let count = message.guild.roles.cache.get('956130443151945758').members.size
		let id = (message.guild.roles.cache.get('956130443151945758').members.map(m => m.user.id));
		console.log(id)
		message.channel.send('Le Mans 6h ' + count + ' members')

	},
};