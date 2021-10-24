import { getRole } from '../../../util';

export const command = 'subscriber';
export const desc = 'Subscribe to game updates.';

/**
 *
 * @param {import('discord.js').Client} client
 * @param {import('discord.js').Message} message
 * @param {import('discord.js').GuildMember} member
 * @return {Promise<void>}
 */
export async function fun(client, message, member) {
    const m = await member.fetch();
    const role = getRole('subscriber');
    if (m.roles.cache.has(role)) {
        await m.roles.remove(role);
        await message.reply("It's sad to see you unsubscribing, but here you go.");
    } else {
        await m.roles.add(role);
        await message.reply('Thanks for subscribing to all important news.');
    }
}
