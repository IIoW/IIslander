import { getRole } from '../../../util';

export const command = 'cooldown';

/**
 *
 * @param {import('discord.js').Client} client
 * @param {import('discord.js').Message} message
 * @param {import('discord.js').GuildMember} member
 * @return {Promise<void>}
 */
export async function fun(client, message, member) {
    const m = await member.fetch(true);
    const role = getRole('notifications_cooldown');
    if (m.roles.cache.has(role)) {
        await m.roles.remove(role);
        await message.reply("You'll now get notified, if one of your Cooldowns ends.");
    } else {
        await m.roles.add(role);
        await message.reply("You won't receive any further cooldown notifications");
    }
}
