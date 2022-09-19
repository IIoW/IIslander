import { getUserLevel } from '../../../permissions';
import Levels from '../../../constants/Levels';
import { getRole } from '../../../util';

export const command = 'spoilores';
export const desc = '';

/**
 *
 * @param {import('discord.js').Client} client
 * @param {import('discord.js').Message} message
 * @param {import('discord.js').GuildMember} member
 * @return {Promise<void>}
 */
export async function fun(client, message, member) {
    const m = await member.fetch();
    const level = getUserLevel(m).user;
    if (level < Levels.MYTHIC) return;
    const role = getRole('spoilores');
    if (m.roles.cache.has(role)) {
        await m.roles.remove(role);
        await message.channel.send(
            "It is always sad to see someone leave this realm. Hopefully we'll see you around soon."
        );
    } else {
        await m.roles.add(role);
        await message.channel.send(
            'Welcome to the secret realm, where all the spoilores are being discussed.'
        );
    }
}
