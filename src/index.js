import { Client, Intents } from 'discord.js';
import config from './config';

const client = new Client({
    intents: [
        Intents.FLAGS.DIRECT_MESSAGES,
        Intents.FLAGS.GUILDS,
        Intents.FLAGS.GUILD_MEMBERS,
        Intents.FLAGS.GUILD_MESSAGES,
        Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
    ],
});

client.login(config.token);

// Temporary sanity check
client.on('ready', () => {
    console.log('Succesfully logged in.');
});
