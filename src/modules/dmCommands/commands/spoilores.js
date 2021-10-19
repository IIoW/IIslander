import { getUserLevel } from '../../../permissions';
import { getRole } from '../../../util';
import Levels from '../../../constants/Levels';

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
    const m = await member.fetch(true);
    const level = getUserLevel(m).user;
    if (level < Levels.MYTHIC) return;
    const role = getRole('spoilores');
    if (m.roles.cache.has(role)) {
        await m.roles.remove(role);
        await message.reply('Welcome to the secret realm, where all spoilores are being discussed');
    } else {
        await m.roles.add(role);
        await message.reply(
            "It is always sad to see someone leave this realm. Hopefully we'll see you around soon"
        );
    }
}
