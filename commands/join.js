module.exports = {
	name: 'join',
	description: 'Provides a link to the channel\'s WebXR channel.',
	execute(message, args) {
		console.log(args);
		message.channel.send('Click the link to join the XR room: <link here>');
	},
};