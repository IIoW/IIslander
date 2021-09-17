import Enmap from 'enmap';
import config from './config';

let client;

/**
 * Passes a client for the util functions to use.
 * @param {import('discord.js').Client} newClient - The client.
 */
const setup = (newClient) => {
    client = newClient;
};

/**
 * Get an emoji from name from the default guild.
 * @param {string} search - The string to search for.
 * @returns {import('discord.js').Emoji} The emoji for that name if found.
 */
const getEmoji = (search) =>
    client.guilds.cache
        .get(config.defaultGuild)
        .emojis.cache.find((emote) => emote.name === search);

/**
 * Databases
 */
const db = Enmap.multi(['autoresponce', 'xp']);

export { setup, getEmoji, db };
