import config from '../../../config';
import { cleanNickname } from '../../../modUtil';
import { fetchUser } from '../../../util';

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
    if (!subCommand) return message.reply('Choose a valid sub-command.');
    switch (subCommand.toLowerCase()) {
        case 'set':
        case 'edit': {
            const user = await fetchUser(args.shift());
            if (!user) return message.reply('Please choose a valid user.');
            const newNick = cleanNickname(args.join(' '));
            if (!newNick) return message.reply('Invalid nickname!');
            // TODO: Use getMember on commentators branch
            // when merged to master.
            const member = await client.guilds.cache
                .get(config.defaultGuild)
                .members.fetch(user.id);
            await member.setNickname(newNick);
            await message.reply(`Successfully set ${user.tag}'s nickname to "${newNick}"`);
            break;
        }

        case 'reset': {
            const user = await fetchUser(args.shift());
            if (!user) return message.reply('Please choose a valid user.');
            const newNick = cleanNickname(user.username) || 'Invalid Nickname';
            // TODO: Use getMember on commentators branch
            // when merged to master.
            const member = await client.guilds.cache
                .get(config.defaultGuild)
                .members.fetch(user.id);
            await member.setNickname(newNick);
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