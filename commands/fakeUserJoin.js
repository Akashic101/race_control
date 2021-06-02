/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */

module.exports = {
	name: `fakeuserjoin`,
	execute(client, message, args) {
		message.client.emit(`guildMemberAdd`, message, message.member);
	},
};