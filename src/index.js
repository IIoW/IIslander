import { Client, GatewayIntentBits, Partials } from 'discord.js';
import config from './config';
import loadModules from './loadModules';
import { responseDb, userDb } from './dbs';
import { setup as utilSetup } from './util';

const client = new Client({
    intents: [
        GatewayIntentBits.DirectMessages,
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildMessageReactions,
        GatewayIntentBits.GuildVoiceStates,
        GatewayIntentBits.MessageContent,
    ],
    partials: [Partials.Channel, Partials.Message, Partials.User, Partials.Reaction],
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
