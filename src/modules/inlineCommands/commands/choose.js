import { getEmoji } from '../../../util';

const command = RegExp('<choose ?\\d>');

/**
 *
 * @param {import('discord.js').Client} client
 * @param {import('discord.js').Message} message
 */
async function fun(client, message) {
    const match = message.content.match(command);
    const amount = parseInt(match[0].replaceAll(/\D/g, ''), 10);
    // If the match is not defined or 0
    if (!amount) return;
    for (let i = 1; i < amount + 1; i += 1) {
        // eslint-disable-next-line no-await-in-loop
        await message.react(getEmoji(`_${i}`));
    }
}

export { command, fun };
