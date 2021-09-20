import { levelMessages, roleMessages } from './messages';
import { getChannel } from '../../util';
import Levels from '../../constants/Levels';

async function sendRoleNotification(member, level) {
    const message = roleMessages[Object.values(Levels).indexOf(level)].replace(
        '[name]',
        member.displayName
    );
    const channel = await getChannel('channelNotification');
    await channel.send(message);
}

/**
 * @param {import('discord.js').GuildMember} member
 * @param {number} level
 */
export default async function sendLevelNotification(member, level) {
    if (Object.values(Levels).indexOf(level) !== -1) return sendRoleNotification(member, level);
    const messageIndex = Math.floor(Math.random() * levelMessages.length);
    const message = levelMessages[messageIndex]
        .replace('[name]', member.displayName)
        .replace('[level]', `${level}`);

    const channel = await getChannel('channelNotification');
    await channel.send(message);

    return true;
}
