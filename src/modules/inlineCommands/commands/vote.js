const command = '<vote>';

/**
 *
 * @param {import('discord.js').Client} client
 * @param {import('discord.js').Message} message
 */
async function fun(client, message) {
    if (message.content.match('<vote>')) {
        await message.react('👍');
        await message.react('👎');
    }
}

export { command, fun };
