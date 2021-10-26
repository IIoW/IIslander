import { MessageEmbed } from 'discord.js';
import { fetchChannel } from '../../../util';

const info = {
    name: 'move',
    desc:
        'Move a bunch of messages!' +
        '\nmove <messageID> <#channel> - Move up to 100 messages **after** the provided message to the provided channel.' +
        "\nmove <number> <#channel> - Moves the last `number` messages to the provided channel. Number can't be higher than 100 .",
    level: 1,
};

/**
 *
 * @param {import('discord.js').Message} message
 */
const genEmbed = async (message) => {
    if (!message.member) await message.guild.members.fetch(message.author);
    const embed = new MessageEmbed()
        .setAuthor(message.member.displayName, message.member.displayAvatarURL({ dynamic: true }))
        .setColor(message.member.displayColor)
        .setDescription(message.content)
        .setTimestamp(message.createdTimestamp);

    if (message.attachments.size) {
        embed.setImage(message.attachments.first().url);
        embed.addField(
            'Attachments:',
            message.attachments.map((a) => `[${a.name}](${a.url})`).join('\n')
        );
    }
    if (message.embeds.length) {
        embed.addField(
            'Embeds:',
            `The next **${message.embeds.length}** embed${
                message.embeds.length === 1 ? ' was' : 's were'
            } attached to this message.`
        );
    }

    return [embed, ...message.embeds];
};

/**
 *
 * @param {MessageEmbed} embed
 */
const countEmbed = (embed) =>
    [
        embed.title,
        embed.description,
        embed.fields.map((f) => [f.name, f.value]),
        embed.footer?.text,
        embed.author?.name,
    ]
        .flat(2)
        .reduce((p, c) => {
            if (typeof c === 'string') return p + c.length;
            return p;
        }, 0);

const move = async (message, limit, channel, after = null) => {
    let msg;
    await message.delete();
    try {
        msg = await message.channel.messages.fetch({ limit, after });
        if (!msg)
            return message.reply('Please provide a valid number from 2-100 or a valid message ID.');
    } catch (e) {
        return message.reply('Please provide a valid number from 2-100 or a valid message ID.');
    }
    const toMove = [
        new MessageEmbed()
            .setTitle('Moved Messages')
            .setDescription(`\`${msg.size}\` messages moved from ${message.channel}!`),
        ...(await Promise.all(msg.map(genEmbed).reverse())),
    ].flat(2);
    const toSend = toMove.reduce((p, embed) => {
        const size = countEmbed(embed);
        if (!p[0])
            p.push({
                size,
                embeds: [embed],
            });
        else {
            const comp = p[p.length - 1];
            // Make sure we don't hit the max 6000 characters in all
            // a messages embeds or the 10 embeds per message.
            if (size + comp.size > 6000 || comp.embeds.length > 9)
                p.push({
                    size,
                    embeds: [embed],
                });
            else {
                comp.embeds.push(embed);
                comp.size += size;
            }
        }
        return p;
    }, []);
    for (const { embeds } of toSend) {
        // eslint-disable-next-line no-await-in-loop
        await channel.send({ embeds });
    }
    await message.channel.bulkDelete(msg);
    return message.channel.send(`Successfully moved \`${msg.size}\` messages to ${channel}!`);
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
    const channel = fetchChannel(args.shift() || '');
    if (!input) return message.reply('Please provide a number or message.');
    if (!channel || !channel.isText()) return message.reply('Please provide a valid text channel.');
    const num = parseInt(input, 10);
    // Not a valid number and not a valid message.
    if (num < 2)
        return message.reply('Please provide a valid number from 2-100 or a valid message ID.');
    // *Might* be a valid message but not a valid number.
    if (num < 100 && !Number.isNaN(num)) return move(message, num, channel);
    // Else try id
    return move(message, 100, channel, input);
}

export { info, fun };
