const dotenv = require('dotenv');
const { deploy } = require('../helpers/deploy');
dotenv.config();

const createRoom = async (guild, channel, memberCount) => {
	const txId = await deploy('./room', guild, channel, memberCount);
	return txId;
};

module.exports = {
	name: 'create',
	description: 'Allows you to create a WebXR channel.',
	execute(message, args) {
		console.log(args);
		message.channel.send('Creating...');
		createRoom(message.guild.name, message.channel.name, message.guild.memberCount).then(url => {
			message.channel.send(`Room created at https://arweave.net/${url}`);
			message.channel.send(`You created an XR version of the channel "#${message.channel.name}".`);
		});
	},
};