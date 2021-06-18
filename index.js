const fs = require('fs');
const dotenv = require('dotenv');
const Discord = require('discord.js');
const express = require('express');
const cors = require('cors');

const PREFIX = '!';

// Initialize Port and App
let port = process.env.PORT;
if (port == null || port == '') {
	port = 8000;
}

const app = express();

dotenv.config();
const client = new Discord.Client();
client.commands = new Discord.Collection();

const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	// set a new item in the Collection
	// with the key as the command name and the value as the exported module
	client.commands.set(command.name, command);
}

client.once('ready', () => {
	console.log('Ready!');
});

client.on('message', message => {
	if (!message.content.startsWith(PREFIX) || message.author.bot) return;

	const args = message.content.slice(PREFIX.length).trim().split(/ +/);
	const commandName = args.shift().toLowerCase();

	if (!client.commands.has(commandName)) return;

	const command = client.commands.get(commandName);

	try {
		command.execute(message, args);
	}
	catch (error) {
		console.error(error);
		message.reply('there was an error trying to execute that command!');
	}
});

app.get('/', async (req, res) => {
	res.send('Homepage');
});

app.use(cors());
app.use(express.json());
app.listen(port, () => console.log(`App listening on port ${port}`));

client.login(process.env.TOKEN);
