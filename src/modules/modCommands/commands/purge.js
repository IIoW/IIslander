import config from '../../../config';
import { removeXp } from '../../../xpHandling';
import getXpOfMessage from '../../leveling/utils';

const info = {
    name: 'purge',
    desc:
        'Delete a bunch of messages!' +
        '\npurge <messageID> - Delete up to 100 messages **after** the provided message.' +
        "\npurge <number> - Deletes the last `number` messages. Number can't be higher than 100.",
    level: 1,
};

const purge = async (message, limit, after = null) => {
    let msg;
    try {
        msg = await message.channel.messages.fetch({ limit, after });
        if (!msg)
            return message.reply('Please provide a valid number from 2-100 or a valid message ID.');
    } catch (e) {
        return message.reply('Please provide a valid number from 2-100 or a valid message ID.');
    }
    const res = await message.channel.bulkDelete(msg);
    // Remove xp
    await Promise.all(
        msg.map(async (m) => {
            if (m.partial || m.author.bot || m.guild?.id !== config.defaultGuild) return;
            await removeXp(message.member, getXpOfMessage(message));
        })
    );
    return message.channel.send(`Successfully deleted \`${res.size}\` messages!`);
};
/**
 *
 * @param {import('discord.js').Client} client
 * @param {import('discord.js').Message} message
 * @param {string[]} args
 */
// eslint-disable-next-line no-unused-vars
async function fun(client, message, args) {
    const input = args.shift();
    if (!input) return message.reply('Please provide a number or message.');
    const num = parseInt(input, 10);
    // Not a valid number and not a valid message.
    if (num < 2)
        return message.reply('Please provide a valid number from 2-100 or a valid message ID.');
    // *Might* be a valid message but not a valid number.
    if (num < 100 && !Number.isNaN(num)) return purge(message, num);
    // Else try id
    return purge(message, 100, input);
}

export { info, fun };
