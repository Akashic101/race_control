/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */

module.exports = (client) => {
	client.channels.cache.get(`885493877186887720`).messages.fetch(`885512977179103263`).then(m => {
        console.log("Cached game-roles message.");
    })

	console.log(`ready`);
};