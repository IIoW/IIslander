import { getUserLevel } from '../../../permissions';
import { userDb } from '../../../util';

export const command = 'spoilores'

/**
 *
 * @param {import('discord.js').Client} client
 * @param {import('discord.js').Message} message
 * @param {import('discord.js').GuildMember} member
 * @return {Promise<void>}
 */
export async function fun(client, message, member) {
    const m = await member.fetch(true)
    const level = getUserLevel(m).user
    console.log(level)

}