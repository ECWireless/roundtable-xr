module.exports = {
	name: 'create',
	description: 'Allows you to create a WebXR channel.',
	execute(message, args) {
		console.log(args);
		message.channel.send(`You created an XR version of the channel "${message.channel.name}".`);
	},
};