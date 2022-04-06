/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
/* eslint-disable no-redeclare */

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

module.exports = async (message, reaction, user) => {

    if (reaction.partial) {
        try {
            await reaction.fetch();
        } catch (error) {
            return console.log(`Something went wrong when fetching the message: `, error);
        }
    }

    if (reaction.message.id != '885512977179103263') return;

    switch (reaction.emoji.name) {
        case '🚙':
            reaction.message.guild.members.fetch(user)
                .then(async (member) => {
                    member.roles.add('834439827071959040').catch(console.error)
                    console.log('added ACC');

                    const tag = await memberDB.findOne({ where: { user_id: member.user.id } });

                    if (tag) {
                        await memberDB.update({ ACC: 1 }, { where: { user_id: member.user.id } });
                        console.log(`User ${member.user.username} has been updated`);
                    }
                })
            break;
        case '🚗':
            reaction.message.guild.members.fetch(user)
                .then(async (member) => {
                    member.roles.add('831455449895272458').catch(console.error)
                    console.log('added RF2');

                    const tag = await memberDB.findOne({ where: { user_id: member.user.id } });

                    if (tag) {
                        await memberDB.update({ RF2: 1 }, { where: { user_id: member.user.id } });
                        console.log(`User ${member.user.username} has been updated`);
                    }
                })
            break;
        case '🏎️':
            reaction.message.guild.members.fetch(user)
                .then(async (member) => {
                    member.roles.add('849642557252436060').catch(console.error)
                    console.log('added AMS2');

                    const tag = await memberDB.findOne({ where: { user_id: member.user.id } });

                   if (tag) {
                       await memberDB.update({ AMS2: 1 }, { where: { user_id: member.user.id } });
                       console.log(`User ${member.user.username} has been updated`);
                   }
                })
            break;
    }
};