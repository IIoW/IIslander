import { getRole } from '../../../util';

export const command = 'tweets';

/**
 *
 * @param {import('discord.js').Client} client
 * @param {import('discord.js').Message} message
 * @param {import('discord.js').GuildMember} member
 * @return {Promise<void>}
 */
export async function fun(client, message, member) {
    const m = await member.fetch(true);
    const role = getRole('tweets');
    if (m.roles.cache.has(role)) {
        await m.roles.remove(role);
        await message.reply('Thanks for subscribing to the twitter notifications');
    } else {
        await m.roles.add(role);
        await message.reply('Its sad to see you unsubscribing, but here you go.');
    }
}