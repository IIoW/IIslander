export const command = 'credits';
export const desc = 'Who made what?';

/**
 *
 * @param {import('discord.js').Client} client
 * @param {import('discord.js').Message} message
 * @return {Promise<void>}
 */
export async function fun(client, message) {
    await message.reply(
        'The game was made by the amazing JWIGGS and this bot by <https://github.com/IIoW/IIslander/graphs/contributors>'
    );
}
