/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */

module.exports = (client) => {
	client.channels.cache.get(`849546394208829470`).messages.fetch(`877228914467045478`).then(m => {
        console.log("Cached game-roles message.");
    })

	console.log(`ready`);
};