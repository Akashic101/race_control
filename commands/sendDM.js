/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */

var pjson = require(`../package.json`);
const Discord = require(`discord.js`);
const Sequelize = require(`sequelize`);

let sendMember = 0;

const memberSeq = new Sequelize(`database`, `user`, `password`, {
	host: `localhost`,
	dialect: `sqlite`,
	logging: false,
	storage: `member.sqlite`,
	supportBigNumbers: true,
});

const memberDB = memberSeq.define(`memberDB`, {
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
	LeMans: {
		type: Sequelize.BOOLEAN,
		defaultValue: 0,
	},
});

memberDB.sync();

var sim;
var dmContent;

//https://discord.com/channels/740493204650197015/849546394208829470/877228914467045478

module.exports = {
	name: `senddm`,
	async execute(client, message, args) {

		let simEmbed = new Discord.MessageEmbed()
			.setTitle(`Choose the simulator`)
			.setColor(`RANDOM`)
			.addFields({
				name: `🚙`,
				value: `Assetto Corsa Competitizone`,
				inline: false
			}, {
				name: `🚗`,
				value: `Indy500`,
				inline: true
			}, {
				name: `🏎️`,
				value: `Automobilista 2`,
				inline: true
			}, {
				name: `🥖`,
				value: `Le Mans`,
				inline: true
			})
			.setTimestamp()
			.setFooter(`${pjson.name} V${pjson.version}`, `https://i.imgur.com/YfAcgNv.png`);
		var msg = await message.channel.send(simEmbed);

		msg.react(`🚙`).then(() => msg.react(`🚗`).then(() => msg.react(`🏎️`)).then(() => msg.react(`🥖`)));

		var filter = (reaction, user) => {
			return [`🚙`, `🚗`, `🏎️`, '🥖'].includes(reaction.emoji.name) && !user.bot && user.id === message.author.id;
		};

		msg.awaitReactions(filter, {
			max: 1,
			time: 60000,
			errors: [`time`]
		})
			.then(async collected => {
				var reaction = collected.first();
				if (reaction.emoji.name === `🚙`) {
					sim = `ACC`;
					acc = 1;
				} else if (reaction.emoji.name === `🚗`) {
					sim = `Indy500`;
					Indy500 = 1;
				} else if (reaction.emoji.name === `🏎️`) {
					sim = `AMS2`;
					ams2 = 1;
				} else if (reaction.emoji.name === `🥖`) {
					sim = `LeMans`;
					LeMans = 1;
				}
			}).then(async empty => {
				let dmEmbed = new Discord.MessageEmbed()
					.setTitle(`Enter the message you want to DM to everyone with the ${sim}-role`)
					.setDescription(`You will be able to confirm the message again after pressing Enter`)
					.setColor(`RANDOM`)
					.setTimestamp()
					.setFooter(`${pjson.name} V${pjson.version}`, `https://i.imgur.com/YfAcgNv.png`)
				message.channel.send(dmEmbed)

				message.channel.awaitMessages(m => m.author.id == message.author.id, {
					max: 1,
					time: 30000
				}).then(async collected => {

					dmContent = collected.first().content;

					let finialDMEmbed = new Discord.MessageEmbed()
						.setTitle(`Final confirmation`)
						.setColor(`RANDOM`)
						.addFields({
							name: `Sim`,
							value: sim,
						}, {
							name: `Message`,
							value: collected.first().content,
						})
						.setTimestamp()
						.setFooter(`${pjson.name} V${pjson.version}`, `https://i.imgur.com/YfAcgNv.png`)
					var msg = await message.channel.send(finialDMEmbed)

					msg.react(`✅`).then(() => msg.react(`❎`));

					var filter = (reaction, user) => {
						return [`✅`, `❎`].includes(reaction.emoji.name) && !user.bot && user.id === message.author.id;
					};

					msg.awaitReactions(filter, {
						max: 1,
						time: 60000,
						errors: [`time`]
					})
						.then(async collected => {
							var reaction = collected.first();
							if (reaction.emoji.name == `✅`) {
								var allMembers;
								if (sim == `ACC`) {
									allMembers = await memberDB.findAll({
										where: {
											ACC: true
										}
									});
								} else if (sim == `Indy500`) {
									allMembers = await memberDB.findAll({
										where: {
											RF2: true
										}
									});

								} else if (sim == `AMS2`) {
									allMembers = await memberDB.findAll({
										where: {
											AMS2: true
										}
									});

								} else if (sim == `LeMans`) {
									allMembers = await memberDB.findAll({
										where: {
											LeMans: true
										}
									});

								}

								allMembers.forEach(element => {
									client.users.fetch(element.dataValues.user_id).then(guy => {
										if (guy.bot == false) {
											guy.send(dmContent)
												.catch(message.channel.send(`Unable to send a message to <@${guy.id}. They have direct messages most likely turned off`))
										}
									})
								})
								let successEmbed = new Discord.MessageEmbed()
									.setTitle('Send message')
									.setColor(`RANDOM`)
									.setTimestamp()
									.setFooter(`${pjson.name} V${pjson.version}`, `https://i.imgur.com/YfAcgNv.png`)
								message.channel.send(successEmbed)

							} else if (reaction.emoji.name == `❎`) {
								let cancelEmbed = new Discord.MessageEmbed()
									.setTitle(`The message has been cancelled`)
									.setColor(`RANDOM`)
									.setTimestamp()
									.setFooter(`${pjson.name} V${pjson.version}`, `https://i.imgur.com/YfAcgNv.png`)
								message.channel.send(cancelEmbed)
							}
						})
				}).catch(() => {
					message.reply('No answer after 30 seconds, operation canceled.');
				});
			})
	},
};