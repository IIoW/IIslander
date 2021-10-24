import { getRole } from '../../../util';

export const command = 'tester';
export const desc = 'Testing the test, to test if testing the testing test, tests the test game.';

/**
 *
 * @param {import('discord.js').Client} client
 * @param {import('discord.js').Message} message
 * @param {import('discord.js').GuildMember} member
 * @return {Promise<void>}
 */
export async function fun(client, message, member) {
    const m = await member.fetch();
    const role = getRole('tester');
    if (m.roles.cache.has(role)) {
        await m.roles.remove(role);
        await message.reply(
            "It's sad that you won't continue on testing test versions of the game"
        );
    } else {
        await m.roles.add(role);
        await message.reply('Thanks for becoming a tester.');
    }
}
