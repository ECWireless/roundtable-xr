const Arweave = require('arweave');
const dotenv = require('dotenv');
dotenv.config();

// initialize Arweave
function useArweave() {
	const arweave = Arweave.init({
		host: 'arweave.net',
		port: 443,
		protocol: 'https',
		timeout: 20000,
		logging: false,
	});

	return arweave;
}
const arweave = useArweave();

const getHtmlData = (guild, channel, memberCount) => {
	const data = `
	<!DOCTYPE html>
	<html lang="en">
	<head>
		<meta charset="UTF-8">
		<meta http-equiv="X-UA-Compatible" content="IE=edge">
		<meta name="viewport" content="width=device-width, initial-scale=1.0">
		<title>RoundTable XR</title>
	</head>
	<body>
		<h1>Congrats! You have created an XR room version of #${channel}</h1>
		<p>Guild name: ${guild}</p>
		<p>Number of members in this channel: ${memberCount}</p>
	</body>
	</html>
	`;
	return data;
};

const createRoom = async (guild, channel, memberCount) => {
	console.log(memberCount);
	const htmlTransaction = await arweave.createTransaction({
		data: getHtmlData(guild, channel, memberCount),
	}, JSON.parse(process.env.WALLET));
	htmlTransaction.addTag('Content-Type', 'text/html');
	await arweave.transactions.sign(htmlTransaction, JSON.parse(process.env.WALLET));

	const uploader = await arweave.transactions.getUploader(htmlTransaction);

	while (!uploader.isComplete) {
		await uploader.uploadChunk();
		console.log(`${uploader.pctComplete}% complete, ${uploader.uploadedChunks}/${uploader.totalChunks}`);
		console.log(htmlTransaction.id);
		return htmlTransaction.id;
	}
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