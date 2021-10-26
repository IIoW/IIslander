import OffenseDescriptions from '../../../constants/OffenseDescriptions';
import { timeout } from '../../../modUtil';
import { fetchUser } from '../../../util';

const info = {
    name: 'timeout',
    desc:
        'Timeouts a member for a certain amount of minutes with a respective specific offense message as well as an explanation for internal use only' +
        '\ntimeout <offenceType> <@member> <minutes> <explanation>',
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
    let [type, user, minutes, ...explanation] = args;
    type = type.toUpperCase();
    if (!OffenseDescriptions[type])
        return message.reply(
            `Type must be one of \`${Object.keys(OffenseDescriptions)
                .map((s) => s.toLowerCase())
                .join('`, `')}\`.`
        );
    user = await fetchUser(user);
    if (!user) return message.reply("I'm sorry I couldn't find that user!");
    minutes = parseFloat(minutes);
    if (!minutes || Number.isNaN(minutes) || minutes < 0)
        return message.reply('That is an invalid time.');
    if (minutes > 34560) return message.reply('Maximum timeout is 2 weeks (34560 minutes)');
    explanation = explanation.join(' ') || 'No further info.';
    await timeout(user, type, explanation, minutes);
    return message.reply(
        `Timed out \`${
            user.tag
        }\` for \`${type.toLowerCase()}\` for ${minutes} minutes for "${explanation}"`
    );
}

export { info, fun };
