import { userDb } from '../../../util';

export const command = 'levelping';
export const desc = 'Get pinged when you level up';
/**
 *
 * @param {import('discord.js').Client} client
 * @param {import('discord.js').Message} message
 * @param {import('discord.js').GuildMember} member
 * @return {Promise<void>}
 */
export async function fun(client, message, member) {
    const userDto = userDb.get(member.id);
    if (!userDto.notifications.get('levelPing')) {
        await message.reply("You'll now get pinged when you level up.");
        userDto.notifications.set('levelPing', true);
    } else {
        await message.reply("You won't receive any further pings on level ups.");
        userDto.notifications.set('levelPing', false);
    }
    userDb.set(member.id, userDto);
}
