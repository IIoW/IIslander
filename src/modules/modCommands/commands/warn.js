import OffenseDescriptions from '../../../constants/OffenseDescriptions';
import { warn } from '../../../modUtil';
import { fetchUser } from '../../../util';

const info = {
    name: 'warn',
    desc:
        'Warns a member given with a respective specific offense message as well as an explanation for internal use only' +
        '\nwarn <offenceType> <@member> <explanation>',
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
    let [type, user, ...explanation] = args;
    type = type.toUpperCase();
    if (!OffenseDescriptions[type])
        return message.reply(
            `Type must be one of \`${Object.keys(OffenseDescriptions)
                .map((s) => s.toLowerCase())
                .join('`, `')}\`.`
        );
    user = await fetchUser(user);
    if (!user) return message.reply("I'm sorry I couldn't find that user!");
    explanation = explanation.join(' ') || 'No further info.';
    await warn(user, type, explanation);
    return message.reply(`Warned \`${user.tag}\` for \`${type.toLowerCase()}\` "${explanation}"`);
}

export { info, fun };
