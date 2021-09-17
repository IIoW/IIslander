import { Client, Intents } from 'discord.js';
import config from './config';
import loadModules from './loadModules';
import { setup as utilSetup } from './util';

const client = new Client({
    intents: [
        Intents.FLAGS.DIRECT_MESSAGES,
        Intents.FLAGS.GUILDS,
        Intents.FLAGS.GUILD_MEMBERS,
        Intents.FLAGS.GUILD_MESSAGES,
        Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
    ],
});

utilSetup(client);
loadModules(client);

client.login(config.token);
