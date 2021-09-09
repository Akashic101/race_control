/* eslint-disable no-undef */
/*-------------------Requierements-------------------*/

const fs = require(`fs`);
require(`dotenv`).config();
const Discord = require(`discord.js`);
const client = new Discord.Client();
const requireAll = require(`require-all`);
const Sequelize = require(`sequelize`);

/*-------------------Requierements-------------------*/

/*----------------------Database----------------------*/

const memberSeq = new Sequelize(`database`, `user`, `password`, {
	host: `localhost`,
	dialect: `sqlite`,
	logging: false,
	storage: `member.sqlite`,
});

const member = memberSeq.define(`member`, {
	id: {
		primaryKey: true,
		type: Sequelize.INTEGER,
		unique: true,
	},
	user_id: {
		type: Sequelize.STRING,
		unique: true,
	},
	ACC: {
		type: Sequelize.BOOLEAN,
		defaultValue: 0,
	},
	RF2: {
		type: Sequelize.BOOLEAN,
		defaultValue: 0,
	},
	AMS2: {
		type: Sequelize.BOOLEAN,
		defaultValue: 0,
	},
});

member.sync();

/*----------------------Database----------------------*/

/*------------------Command Handler------------------*/

client.commands = new Discord.Collection();

const commandFiles = fs.readdirSync(`./commands`).filter(file => file.endsWith(`.js`));
for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	client.commands.set(command.name, command);
}

/*------------------Command Handler------------------*/

/*-------------------Event Handler-------------------*/

const files = requireAll({
	dirname: `${__dirname}/events`,
	filter: /^(?!-)(.+)\.js$/
});

for (const name in files) {
	const event = files[name];
	client.on(name, event.bind(null, client));
}

/*-------------------Event Handler-------------------*/

/*-----------------------Login-----------------------*/

const token = process.env.DISCORD_TOKEN;

client.login(token);

/*-----------------------Login-----------------------*/

/*-----------------messageReactionAdd-----------------*/

client.on(`messageReactionAdd`, async (reaction, user) => {

	if (reaction.partial) {
		try {
			await reaction.fetch();
		} catch (error) {
			return console.log(`Something went wrong when fetching the message: `, error);
		}
	}

	if (reaction.message.id == '885512977179103263') {
		switch (reaction.emoji.name) {
			case '🚙':
				reaction.message.guild.members.fetch(user)
					.then((member) => {
						member.roles.add(`834439827071959040`).catch(console.error);
						console.log(`Added ACC to ${member.displayName}`);
					});

				var driver = await member.findOne({
					where: {
						user_id: reaction.message.author.id
					}
				});

				if (driver) {
					console.log(`Found driver to update`)
					await member.update({
						ACC: true
					}, {
						where: {
							user_id: reaction.message.author.id
						}
					});
				} else {
					await member.create({
						user_id: reaction.message.author.id,
						ACC: true
					});
				}
				console.log('Beep beep, you have now the Assetto Corsa Competitizone-Role')
				break;
			case '🚗':
				reaction.message.guild.members.fetch(user)
					.then((member) => {
						member.roles.add(`831455449895272458`).catch(console.error);
						console.log(`Added RF2 to ${member.displayName}`);
					});

				var driver = await member.findOne({
					where: {
						user_id: reaction.message.author.id
					}
				});

				if (driver) {
					console.log(`Found driver to update`)
					await member.update({
						RF2: true
					}, {
						where: {
							user_id: reaction.message.author.id
						}
					});
				} else {
					await member.create({
						user_id: reaction.message.author.id,
						RF2: true
					});
				}
				console.log('Beep beep, you have now the Rfactor 2-Role')
				break;
			case '🏎️':
				reaction.message.guild.members.fetch(user)
					.then((member) => {
						member.roles.add(`849642557252436060`).catch(console.error);
						console.log(`Added AMS2 to ${member.displayName}`);
					});

				var driver = await member.findOne({
					where: {
						user_id: reaction.message.author.id
					}
				});

				if (driver) {
					console.log(`Found driver to update`)
					await member.update({
						AMS2: true
					}, {
						where: {
							user_id: reaction.message.author.id
						}
					});
				} else {
					await member.create({
						user_id: reaction.message.author.id,
						AMS2: true
					});
				}
				console.log('Beep beep, you have now the Automobilista 2-Role')
				break;
		}
	}
});

/*-----------------messageReactionAdd-----------------*/

/*---------------messageReactionRemove---------------*/

client.on(`messageReactionRemove`, async (reaction, user) => {

	if (reaction.partial) {
		try {
			await reaction.fetch();
		} catch (error) {
			return console.log(`Something went wrong when fetching the message: `, error);
		}
	}

	if (reaction.message.id == '885512977179103263') {
		switch (reaction.emoji.name) {
			case '🚙':
				reaction.message.guild.members.fetch(user)
					.then((member) => {
						member.roles.remove(`834439827071959040`).catch(console.error);
						console.log(`Removed ACC to ${member.displayName}`);
					});

				var driver = await member.findOne({
					where: {
						id: reaction.message.author.id
					}
				});

				if (driver) {
					console.log(`Found driver to update`)
					await member.update({
						ACC: false
					}, {
						where: {
							id: reaction.message.author.id
						}
					});
				} else {
					await member.create({
						id: reaction.message.author.id,
						ACC: false
					});
				}
				//reaction.message.channel.send('Beep beep, the Assetto Corsa Competitizone-Role got removed')
				break;
			case '🚗':
				reaction.message.guild.members.fetch(user)
					.then((member) => {
						member.roles.remove(`831455449895272458`).catch(console.error);
						console.log(`Removed RF2 to ${member.displayName}`);
					});

				var driver = await member.findOne({
					where: {
						id: reaction.message.author.id
					}
				});

				if (driver) {
					console.log(`Found driver to update`)
					await member.update({
						RF2: false
					}, {
						where: {
							id: reaction.message.author.id
						}
					});
				} else {
					await member.create({
						id: reaction.message.author.id,
						RF2: false
					});
				}
				//reaction.message.channel.send('Beep beep, the RFactor 2-Role got removed')
				break;
			case '🏎️':
				reaction.message.guild.members.fetch(user)
					.then((member) => {
						member.roles.remove(`849642557252436060`).catch(console.error);
						console.log(`Removed AMS2 to ${member.displayName}`);
					});

				var driver = await member.findOne({
					where: {
						id: reaction.message.author.id
					}
				});

				if (driver) {
					console.log(`Found driver to update`)
					await member.update({
						AMS2: false
					}, {
						where: {
							id: reaction.message.author.id
						}
					});
				} else {
					await member.create({
						id: reaction.message.author.id,
						AMS2: false
					});
				}
				//reaction.message.channel.send('Beep beep, the Automobilista 2-Role got removed')
				break;
		}
	}
});

/*---------------messageReactionRemove---------------*/