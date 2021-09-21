import { levelMessages, roleMessages } from './messages';
import { getChannel } from '../../util';
import Levels from '../../constants/Levels';

/**
 * Replace objects in block brackets with the values in the passed object.
 * @param {string} string - The string to replace
 * @param {Object<string, string>} values - An object with strings to replace with.
 * @returns {string} The new string.
 */
async function replaceAndSend(string, values) {
    const message = string.replace(/\[(\w+)\]/g, (orig, key) => values[key] || orig);
    const channel = await getChannel('channelNotification');
    await channel.send(message);
}

async function sendRoleNotification(member, level) {
    await replaceAndSend(roleMessages[Object.values(Levels).indexOf(level)], {
        name: `**<@${member.user.id}>**`,
    });
}

/**
 * @param {import('discord.js').GuildMember} member
 * @param {number} level
 */
export default async function sendLevelNotification(member, level) {
    if (Object.values(Levels).indexOf(level) !== -1 && level !== 0)
        return sendRoleNotification(member, level);
    const messageIndex = Math.floor(Math.random() * levelMessages.length);

    await replaceAndSend(levelMessages[messageIndex], {
        name: `**${member.displayName}**`,
        level: `**Level ${level}**`,
    });

    return true;
}
