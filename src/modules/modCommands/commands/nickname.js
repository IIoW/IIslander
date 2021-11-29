import { cleanNickname } from '../../../modUtil';
import { fetchUser, getMember } from '../../../util';

const info = {
    name: 'nickname',
    desc:
        "Change or reset a user's nickname!" +
        "\nnickname edit <@user> <new nickname> - Edit a user's nickname." +
        "\nnickname reset <@user> - Reset a user's nickname.",
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
    const subCommand = args.shift();
    if (!subCommand) return message.reply('Please choose a valid sub-command.');
    switch (subCommand.toLowerCase()) {
        case 'set':
        case 'edit': {
            const user = await fetchUser(args.shift());
            if (!user) return message.reply('Please choose a valid user.');
            const newNick = cleanNickname(args.join(' '));
            if (!newNick) return message.reply('Invalid nickname!');
            const member = await getMember(user.id);
            try {
                await member.setNickname(newNick);
            } catch (e) {
                return message.reply("I do not have permission to change that user's nickname!");
            }
            await message.reply(`Successfully set ${user.tag}'s nickname to "${newNick}"`);
            break;
        }

        case 'reset': {
            if (!args[0]) return message.reply('Please choose a valid user.');
            const user = await fetchUser(args.shift());
            if (!user) return message.reply('Please choose a valid user.');
            const newNick = cleanNickname(user.username) || 'Invalid Nickname';
            const member = await getMember(user.id);
            try {
                await member.setNickname(newNick);
            } catch (e) {
                return message.reply("I do not have permission to change that user's nickname!");
            }
            await message.reply(`Successfully reset ${user.tag}'s nickname to "${newNick}"`);
            break;
        }
        default:
            await message.reply('Please choose a valid sub-command.');
            break;
    }
    return null;
}

export { info, fun };
