const dotenv = require('dotenv');
const { deploy } = require('../helpers/deploy');
dotenv.config();

const createRoom = async (guild, channel, memberCount) => {
	const txId = await deploy('./room/dist', guild, channel, memberCount);
	console.log(txId);
	return txId;
};

const createVillage = async (guild, channel, memberCount) => {
	const txId = await deploy('./village', guild, channel, memberCount);
	return txId;
};

module.exports = {
	name: 'create',
	description: 'Allows you to create a WebXR channel.',
	execute(message, args) {
		message.channel.send('Creating...');
		switch (args[0]) {
		case 'village':
			createVillage(message.guild.name, message.channel.name, message.guild.memberCount).then(url => {
				message.channel.send(`Room created at https://arweave.net/${url}`);
				message.channel.send(`You created an XR version of the channel "#${message.channel.name}".`);
			});
			break;

		default:
			createRoom(message.guild.name, message.channel.name, message.guild.memberCount).then(url => {
				message.channel.send(`Room created at https://arweave.net/${url}`);
				message.channel.send(`You created an XR version of the channel "#${message.channel.name}".`);
			});
			break;
		}
	},
};