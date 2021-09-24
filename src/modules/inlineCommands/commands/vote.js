import Emotes from '../../../constants/Emotes';

const command = '<vote>';

/**
 *
 * @param {import('discord.js').Client} client
 * @param {import('discord.js').Message} message
 */
async function fun(client, message) {
    if (message.content.match('<vote>')) {
        await message.react(Emotes.thumbUp);
        await message.react(Emotes.thumbDown);
    }
}

export { command, fun };
