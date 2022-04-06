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
