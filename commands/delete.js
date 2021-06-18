module.exports = {
	name: 'delete',
	description: 'Allows you to delete your WebXR channel.',
	execute(message, args) {
		console.log(args);
		message.channel.send('You have deleted the XR version of this channel.');
	},
};