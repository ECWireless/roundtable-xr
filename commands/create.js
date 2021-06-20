const dotenv = require('dotenv');
const { deploy } = require('../helpers/deploy');
dotenv.config();

const createRoom = async (guild, channel, memberCount) => {
	// console.log(memberCount);
	// const htmlTransaction = await arweave.createTransaction({
	// 	data: getHtmlData(guild, channel, memberCount),
	// }, JSON.parse(process.env.WALLET));
	// htmlTransaction.addTag('Content-Type', 'text/html');
	// await arweave.transactions.sign(htmlTransaction, JSON.parse(process.env.WALLET));

	// const uploader = await arweave.transactions.getUploader(htmlTransaction);

	// while (!uploader.isComplete) {
	// 	await uploader.uploadChunk();
	// 	console.log(`${uploader.pctComplete}% complete, ${uploader.uploadedChunks}/${uploader.totalChunks}`);
	// 	console.log(htmlTransaction.id);
	// 	return htmlTransaction.id;
	// }
	const txId = await deploy('./room');
	return txId;
};

module.exports = {
	name: 'create',
	description: 'Allows you to create a WebXR channel.',
	execute(message, args) {
		console.log(args);
		createRoom(message.guild.name, message.channel.name, message.guild.memberCount).then(url => {
			message.channel.send(`Room created at https://arweave.net/${url}`);
			message.channel.send(`You created an XR version of the channel "#${message.channel.name}".`);
		});
	},
};