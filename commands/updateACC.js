/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */

var pjson = require(`../package.json`);
const Discord = require(`discord.js`);
const Sequelize = require(`sequelize`);

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

module.exports = {
	name: `updateacc`,
	 execute(client, message, args) {
		let id = (message.guild.roles.cache.get('834439827071959040').members.map(m => m.user.id));
		id.forEach( async element => {

			const tag = await memberDB.findOne({ where: { user_id: element } });

			if(tag) {
				const affectedRows = await memberDB.update({ ACC: 1 }, { where: { user_id: element } });
				console.log(`User ${element} has been updated`);
			}
			else {
				const tag = await memberDB.create({
					user_id: element,
					ACC: 1,
					RF2: 0,
					AMS2: 0,
					LeMans: 0
				});
				console.log(`User ${element} has been added`);
			}
		});
	},
};