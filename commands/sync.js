module.exports = {
	name: 'sync',
	description: 'Allows you to sync with your WebXR channel.',
	execute(message, args) {
		console.log(args);
		message.channel.send(`You are now synced with the XR version of the channel "${message.channel.name}".`);
	},
};