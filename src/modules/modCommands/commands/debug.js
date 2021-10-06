import { userDb } from '../../../util';

const info = {
    name: 'debug',
    desc: 'Ping pong!',
    level: 0,
};

/**
 *
 * @param {import('discord.js').Client} client
 * @param {import('discord.js').Message} message
 * @param {string[]} args
 */
// eslint-disable-next-line no-unused-vars
async function fun(client, message, args) {
    const userDto = userDb.get(message.author.id);
    await message.reply(`xp: ${userDto.xp}, level: ${userDto.level}`);
}

export { info, fun };
