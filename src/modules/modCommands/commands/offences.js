import { MessageEmbed } from 'discord.js';
import { fetchUser, userDb } from '../../../util';

const info = {
    name: 'offences',
    desc:
        'Get a list of past user actions' +
        '\noffences <@member> - See past 25 offences for a member' +
        '\noffences <@member> <number> - See a certain offence for a member',
    level: 2,
};

/**
 *
 * @param {import('discord.js').Client} client
 * @param {import('discord.js').Message} message
 * @param {string[]} args
 */
// eslint-disable-next-line no-unused-vars
async function fun(client, message, args) {
    const user = await fetchUser(args[0]);
    if (!user) return message.reply("I'm sorry I couldn't find that user!");
    if (args[1]) {
        const num = parseInt(args[1], 10);
        if (!num || Number.isNaN(num) || num < 1)
            return message.reply('Please choose a valid number.');
        const { offences } = userDb.get(user.id);
        const offence = offences[num - 1];
        if (!offence) return message.reply('Invalid offence!');
        const embed = new MessageEmbed()
            .setDescription(
                `Offence #${num} for ${user}.\n${offence.type}\n${offence.offence}\n<t:${Math.round(
                    offence.time / 1000
                )}:f>\n${offence.xpDeduction ? `XP Deducted: ${offence.xpDeduction}\n` : ''}${
                    offence.isRecent ? 'Recent Offence!\n' : ''
                }${offence.modReason || 'Error Getting reason'}`
            )
            .setColor('RED');
        return message.reply({ embeds: [embed] });
    }
    const { offences } = userDb.get(user.id);
    const [fields, recentOffences, xpDeduced] = offences.reduce(
        ([embedFields, recent, xp], o, i) => {
            if (o.isRecent) recent += 1;
            xp += o.xpDeduction;
            // Only show the latest 25 responses.
            if (offences.length - i < 26)
                embedFields.push({
                    name: `#${i + 1}:`,
                    value: `${o.type}\n${o.offence}\n<t:${Math.round(o.time / 1000)}:f>\n${
                        o.xpDeduction ? `XP Deducted: ${o.xpDeduction}\n` : ''
                    }${o.modReason || 'Error Getting reason'}`,
                    inline: true,
                });
            return [embedFields, recent, xp];
        },
        [[], 0, 0]
    );
    const embed = new MessageEmbed()
        .setDescription(
            `Offences for ${user}.\nRecent Offences: ${recentOffences}\nTotal Offences: ${
                offences.length
            }\nTotal XP Deducted: ${xpDeduced}${
                offences.length > 25 ? "\nNote all offences couldn't fit on this page." : ''
            }`
        )
        .addFields(fields)
        .setColor('RED');
    return message.reply({ embeds: [embed] });
}

export { info, fun };
