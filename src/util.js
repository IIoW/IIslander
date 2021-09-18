import Enmap from 'enmap';
import config from './config';
import UserDto from './dto/UserDto';
import ResponseDto from './dto/ResponseDto';
import { awardLevel, pin } from './permissions';

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

function permissionFor(userDto, member) {
    return {
        awardLevel: awardLevel(member),
        pin: pin(member),
    };
}

/**
 * Databases
 */

function serializer(object) {
    return object.toJson();
}

function deserializerUserDto(object) {
    return UserDto.fromJson(object);
}

function deserializerResponseDto(object) {
    return ResponseDto.fromJson(object);
}

const userDb = new Enmap({
    name: 'users',
    serializer,
    deserializer: deserializerUserDto,
});

const responseDb = new Enmap({
    name: 'autoresponses',
    serializer,
    deserializer: deserializerResponseDto,
});

export { setup, getEmoji, permissionFor, userDb, responseDb };
