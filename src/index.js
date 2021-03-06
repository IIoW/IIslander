import { Client, Intents } from 'discord.js';
import config from './config';
import loadModules from './loadModules';
import { responseDb, userDb } from './dbs';
import { setup as utilSetup } from './util';

const client = new Client({
    intents: [
        Intents.FLAGS.DIRECT_MESSAGES,
        Intents.FLAGS.GUILDS,
        Intents.FLAGS.GUILD_MEMBERS,
        Intents.FLAGS.GUILD_MESSAGES,
        Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
        Intents.FLAGS.GUILD_VOICE_STATES,
    ],
    partials: ['CHANNEL', 'MESSAGE', 'USER', 'REACTION'],
});

utilSetup(client);
loadModules(client);

client.login(config.token);

function shutdown() {
    client.destroy();
    userDb.close();
    responseDb.close();
    process.exit(0);
}

process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);
