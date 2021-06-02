/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
/* eslint-disable no-redeclare */

require(`dotenv`).config();

const prefix = `!`;

module.exports = async (client, message) => {

	const args = message.content.slice(prefix.length).trim().split(/ +/);
	const commandName = args.shift().toLowerCase();

	if (!message.content.startsWith(prefix) || message.author.bot || message.author.self || !client.commands.has(commandName)) return;

	const command = client.commands.get(commandName);

	return command.execute(client, message, args);
				
};
