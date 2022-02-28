import { Util } from 'discord.js';
import config from './config';
import Emotes from './constants/Emotes';

/**
 * @type {import('discord.js').Client}
 */
let client;

/**
 * Passes a client for the util functions to use.
 * @param {import('discord.js').Client} newClient - The client.
 */
const setup = (newClient) => {
    client = newClient;
};
const getClient = () => client;

/**
 * Get an emoji by name from the default guild.
 * @param {string} search - The string to search for.
 * @returns {import('discord.js').EmojiIdentifierResolvable} The emoji for that name if found.
 */
const getEmoji = (search) =>
    client.guilds.cache
        .get(config.defaultGuild)
        .emojis.cache.find((emote) => emote.name === search) || search;
/**
 * Gets a member by their id
 * @param query
 * @returns {import('discord.js').GuildMember}
 */
const getMember = async (query) => {
    const mention = /<@!?(\d+)>/;
    const match = query.match(mention);
    const user = match ? match[1] : query;
    let result;
    try {
        result = await (await client.guilds.fetch(config.defaultGuild)).members.fetch(user);
    } catch (e) {
        // ignore errors
    }
    return result;
};

/**
 * @param {string} name
 * @returns {import('discord.js').Channel}
 */
function getChannel(name) {
    return client.channels.cache.get(config.channels.get(name));
}

/**
 * @param {string} name
 * @returns {Promise<import('discord.js').Message>}
 */
function getMessage(name) {
    const message = config.messages.get(name);
    const channel = getChannel(message.channel);
    return channel.messages.fetch(message.id);
}

async function editMessage(name, ...content) {
    const msg = await getMessage(name);
    return msg.edit(...content);
}

/**
 * Fetch a user by id or mention string.
 * @param {string} query - The user id or ping of the user.
 * @returns {Promise<import('discord.js').User | null>} The user.
 */
const fetchUser = async (query) => {
    if (!query) return null;
    const mention = /<@!?(\d+)>/;
    const match = query.match(mention);
    const user = match ? match[1] : query;
    let result;
    try {
        result = await client.users.fetch(user);
    } catch (e) {
        // ignore errors
    }
    return result;
};
/**
 * Fetch a channel by id or mention string.
 * @param {string} query - The channel id or ping of the channel.
 * @returns {import('discord.js').Channel | null} The channel.
 */
const fetchChannel = (query) => {
    if (!query) return null;
    const mention = /<#(\d+)>/;
    const match = query.match(mention);
    const channel = match ? match[1] : query;
    let result;
    try {
        result = client.channels.cache.get(channel);
    } catch (e) {
        // ignore errors
    }
    return result;
};

/**
 * @param {string} name
 * @return {import('discord.js').RoleResolvable}
 */
function getRole(name) {
    return config.roles.get(name);
}

/**
 * Gets role info and adds it. Will not error if the role or member doesn't exist.
 * @param {string} name - The name of the role.
 * @param {import('discord.js'.GuildMemberResolvable)} memberResolvable - The member to add.
 * @returns {false|Promise<import('discord.js').GuildMember>} Returns false if the role or member doesn't exist. Otherwise returns the result of adding a role.
 */
function getAndAddRole(name, memberResolvable) {
    const guild = client.guilds.cache.get(config.defaultGuild);
    const role = getRole(name);
    const member = guild.members.resolve(memberResolvable);
    if (!role || !guild || !member) return false;
    return member.roles.add(role);
}

/**
 * Converts a js timestamp to a discord markdown timestamp.
 * @param {number} time - The js timestamp to convert.
 * @param {'t'|'T'|'d'|'D'|'f'|'F'|'R'} format - The format to display the timestamp in.
 * @see {@link https://discord.com/developers/docs/reference#message-formatting-timestamp-styles The Discord Docs on Timestamp Markdown}
 * @returns {string} The timestamp stringified.
 */
function stringifyTimestamp(time, format = 'f') {
    return `<t:${Math.round(time / 1000)}:${format}>`;
}

function sanitizeUserInput(input) {
    return Util.escapeMarkdown(input).replace(/@|#/g, '$&\u200b');
}

/**
 * Transforms a string to an emojified representation of itself.
 * NOTE: This will remove any non-alphanumeric characters.
 * @param {String} string - The string to transform.
 * @returns {String} The finished string.
 */
function makeTitle(string) {
    let res = '';
    for (const char of string) {
        if (/[a-zA-Z0-9 ]/.test(char))
            res += char === ' ' ? '     ' : getEmoji(Emotes.font[char.toLowerCase()]).toString();
    }
    return res;
}

/**
 * Counts the characters in an embed.
 * @param {import('discord.js').MessageEmbed} embed
 */
const countEmbedCharacters = (embed) =>
    [
        embed.title,
        embed.description,
        embed.fields.map((f) => [f.name, f.value]),
        embed.footer?.text,
        embed.author?.name,
    ]
        .flat(2)
        .reduce((p, c) => {
            if (typeof c === 'string') return p + c.length;
            return p;
        }, 0);

/**
 * Used to get the time of midnight tomorrow
 * @returns {number} The unix time in milliseconds at midnight tomorrow.
 */
function getTomorrow() {
    return new Date().setUTCHours(24, 0, 0, 0);
}

export {
    setup,
    getEmoji,
    getMessage,
    getMember,
    getChannel,
    editMessage,
    fetchChannel,
    fetchUser,
    getRole,
    getAndAddRole,
    stringifyTimestamp,
    makeTitle,
    countEmbedCharacters,
    getTomorrow,
    getClient,
    sanitizeUserInput,
};
