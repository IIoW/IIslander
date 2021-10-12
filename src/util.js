import Enmap from 'enmap';
import config from './config';
import UserDto from './dto/UserDto';
import ResponseDto from './dto/ResponseDto';

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
    const mention = new RegExp(/<@!?(\d+)>/);
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
 *
 * @param {string} name
 * @return {import('discord.js').RoleResolvable}
 */
function getRole(name) {
    return config.roles.get(name);
}

// Databases

/**
 * Serialize database objects.
 */
function serializer(object) {
    return object.toJSON();
}
/**
 * Deserialize user database objects.
 */
function deserializerUserDto(object) {
    return UserDto.fromJSON(object);
}
/**
 * Deserialize auto response database objects.
 */
function deserializerResponseDto(object) {
    return ResponseDto.fromJSON(object);
}

/**
 * Database to store user data in it.
 * @type {Enmap<string, UserDto>}
 * @see {@link UserDto}
 */
const userDb = new Enmap({
    name: 'users',
    serializer,
    deserializer: deserializerUserDto,
    autoEnsure: new UserDto(),
});

/**
 * Database to store auto response data in it.
 * @type {Enmap<string, ResponseDto>}
 * @see {@link ResponseDto}
 */
const responseDb = new Enmap({
    name: 'autoresponses',
    serializer,
    deserializer: deserializerResponseDto,
    autoEnsure: new ResponseDto(),
});

export { setup, getEmoji, userDb, responseDb, getChannel, getRole, getMember };
