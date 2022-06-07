/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */

var pjson = require(`../package.json`);
const Discord = require(`discord.js`);

module.exports = {
	name: `senddm`,
	execute(client, message, args) {
		let roleToDM;
		let messageToSend;
        let memberCount;

		let rolemap = message.guild.roles.cache.map((r) => r);

		if (rolemap.length > 1024) rolemap = `To many roles to display`;
		if (!rolemap) rolemap = `No roles`;

		const displayRolesEmbed = new Discord.MessageEmbed()
			.setTitle(`Sending a DM`)
			.setDescription(
				`Please select a role you want to write a message to. You have 30s to do this or this command will be cancelled`
			)
			.setColor(`RANDOM`)
			.addField(`Role List`, rolemap)
			.setTimestamp()
			.setFooter(
				`${pjson.name} V${pjson.version}`,
				`https://i.imgur.com/YfAcgNv.png`
			);
		message.channel.send(displayRolesEmbed);

		message.channel
			.awaitMessages((m) => m.author.id == message.author.id, { max: 1, time: 30000 })
			.then((collected) => {
				roleToDM = collected.first().content;

				let roleID = roleToDM.replace(/[^0-9]/g, ``);
				memberCount = message.guild.roles.cache.get(roleID).members.size;
				console.log(memberCount);

				const messageToSendEmbed = new Discord.MessageEmbed()
					.setTitle(`Sending a DM`)
					.setDescription(
						`**You selected: ** \n\n ${roleToDM} which has ${memberCount} member/s\n\n Please enter the message you want to send. You have 2 minutes to do this or the command will be cancelled`
					)
					.setColor(`RANDOM`)
					.setTimestamp()
					.setFooter(
						`${pjson.name} V${pjson.version}`,
						`https://i.imgur.com/YfAcgNv.png`
					);

				message.channel.send(messageToSendEmbed);

				message.channel
					.awaitMessages((m) => m.author.id == message.author.id, { max: 1, time: 30000 })
					.then((collected) => {
						messageToSend = collected.first().content;

						const confirmationEmbed = new Discord.MessageEmbed()
							.setTitle(`Sending a DM`)
							.setDescription(
								`Sending your message will take around ${memberCount/2} seconds. Please write **confirm** if you want to send the message or **deny** if you want to cancel the operation`
							)
							.addFields(
								{ name: `Role`, value: `${roleToDM}` },
								{ name: `Message`, value: `${messageToSend}` }
							)
							.setColor(`RANDOM`)
							.setTimestamp()
							.setFooter(
								`${pjson.name} V${pjson.version}`,
								`https://i.imgur.com/YfAcgNv.png`
							);

						message.channel.send(confirmationEmbed);

						message.channel
							.awaitMessages((m) => m.author.id == message.author.id, { max: 1, time: 30000 })
							.then((collected) => {
								confirmation = collected.first().content;

								if (confirmation == `confirm`) {
									let roleID = roleToDM.replace(/[^0-9]/g, ``);
									let membersWithRole = message.guild.roles.cache
										.get(roleID)
										.members.map((m) => m.user.id);

									membersWithRole.forEach((member, i) => {
										setTimeout(function () {
											client.users.cache.get(member).send(messageToSend);
										}, i * 500);
									});

									const confirmEmbed = new Discord.MessageEmbed()
										.setTitle(`Sending a DM`)
										.setDescription(`Message has been send`)
										.setColor(`RANDOM`)
										.setTimestamp()
										.setFooter(
											`${pjson.name} V${pjson.version}`,
											`https://i.imgur.com/YfAcgNv.png`
										);
									message.channel.send(confirmEmbed);
								} else if (confirmation == `deny`) {
									const denyEmbed = new Discord.MessageEmbed()
										.setTitle(`Sending a DM`)
										.setDescription(`Operation has been cancelled`)
										.setColor(`RANDOM`)
										.setTimestamp()
										.setFooter(
											`${pjson.name} V${pjson.version}`,
											`https://i.imgur.com/YfAcgNv.png`
										);
									message.channel.send(denyEmbed);
								} else {
									const otherEmbed = new Discord.MessageEmbed()
										.setTitle(`Sending a DM`)
										.setDescription(`You did not enter confirm or deny`)
										.setColor(`RANDOM`)
										.setTimestamp()
										.setFooter(
											`${pjson.name} V${pjson.version}`,
											`https://i.imgur.com/YfAcgNv.png`
										);
									message.channel.send(otherEmbed);
								}
							})
							.catch((e) => {
								message.reply(`error: ` + e);
							});
					})
					.catch((e) => {
						message.reply(`No answer after 120 seconds, operation canceled.` + e);
					});
			})
			.catch((e) => {
				message.reply(`No answer after 120 seconds, operation canceled.` + e);
			});
	},
};
