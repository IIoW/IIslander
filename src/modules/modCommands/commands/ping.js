const info = {
    name: 'ping',
    desc: 'Ping pong!',
    level: 1,
};

/**
 *
 * @param {import('discord.js').Client} client
 * @param {import('discord.js').Message} message
 * @param {string[]} args
 */
// eslint-disable-next-line no-unused-vars
async function fun(client, message, args) {
    const msg = await message.reply('Pong!');
    return msg.edit(
        `Ping! Latency is ${msg.createdTimestamp - message.createdTimestamp}ms. Api latency is ${
            client.ws.ping
        }ms.`
    );
}

export { info, fun };
