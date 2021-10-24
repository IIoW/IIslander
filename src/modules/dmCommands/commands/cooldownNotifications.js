import { userDb } from '../../../util';

export const command = 'cooldown';
export const desc = 'Notifies you when any of your cooldowns end.';
/**
 *
 * @param {import('discord.js').Client} client
 * @param {import('discord.js').Message} message
 * @param {import('discord.js').GuildMember} member
 * @return {Promise<void>}
 */
export async function fun(client, message, member) {
    const userDto = userDb.get(member.id);
    if (!userDto.notifications.get('cooldownEnd')) {
        await message.reply("You'll now get notified when any of your cooldowns end.");
        userDto.notifications.set('cooldownEnd', true);
    } else {
        await message.reply("You won't receive any further cooldown notifications.");
        userDto.notifications.set('cooldownEnd', false);
    }
    userDb.set(member.id, userDto);
}
