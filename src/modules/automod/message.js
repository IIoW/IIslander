import Blacklist from '../../constants/Blacklist';
import { getChannel, userDb } from '../../util';
import { logMessages, swearWarning } from '../../constants/Messages';
import { xpCooldown } from '../../constants/Awards';
import { getUserMod } from '../../permissions';
import Mod from '../../constants/Mod';
import { penalize } from '../../modUtil';

/**
 *
 * @param {import('discord.js').Client} client
 * @param {import('discord.js').Message} message
 * @return {Promise<void>}
 */
async function handleSwearing(client, message) {
    const content = message.content
        .toLowerCase()
        .replaceAll('0', 'o')
        .replaceAll(/1|!/g, 'i')
        .replaceAll('3', 'e')
        .replaceAll(/4|@/g, 'a')
        .replaceAll('5', 's')
        .replaceAll(/7|\+/g, 't')
        .replaceAll('8', 'b')
        .replaceAll(/[^a-z]/g, '');
    const regex = Blacklist.swearwords.join('|');
    const match = content.match(regex);
    if (match) {
        const userDto = userDb.get(message.author.id);
        const now = Date.now();
        const cooldown = userDto.cooldown.get('swearing');
        if (now > cooldown) {
            userDto.swearlevel = 0; // resets the swear level, if time ran out
        }
        userDto.swearlevel += 1;
        switch (userDto.swearlevel) {
            case 1:
                await message.author
                    .send(swearWarning[0])
                    .catch((e) => console.error('Error sending dm', e));
                break;
            case 2:
                await message.author
                    .send(swearWarning[1])
                    .catch((e) => console.error('Error sending dm', e));
                break;
            default:
                await penalize(
                    message.author,
                    'SWEARING',
                    `[automod] ${logMessages
                        .get('swearing')
                        .replace('[user]', message.member)
                        .replace('[message]', message.content)
                        .replace('[match]', match[0])}`
                );
        }
        userDto.cooldown.set('swearing', now + xpCooldown.swearing);
        userDb.set(message.author.id, userDto);
        await getChannel('log').send(
            logMessages
                .get('swearing')
                .replace('[user]', message.member)
                .replace('[message]', message.content)
                .replace('[match]', match[0])
        );
    }
}

/**
 *
 * @param {import('discord.js').Client} client
 * @param {import('discord.js').Message} message
 * @return {Promise<void>}
 */
async function handlePings(client, message) {
    if (getUserMod(message.member) >= Mod.ENFORCER) return;
    if (message.content.match('@(everyone|here)')) {
        const userDto = userDb.get(message.author.id);
        const now = Date.now();
        const cooldown = userDto.cooldown.get('everyoneping');
        if (now > cooldown) {
            userDto.everyoneping = 0; // resets the ping counter, if time ran out
        }
        userDto.everyoneping += 1;
        await message.delete();
        userDto.cooldown.set('everyoneping', now + xpCooldown.everyoneping);
        userDb.set(message.author.id, userDto);
        await getChannel('log').send(
            logMessages
                .get('everyoneping')
                .replace('[user]', message.member)
                .replace('[message]', message.content)
        );
        switch (userDto.everyoneping) {
            case 1:
            case 2:
                await message.author
                    .send('Pinging everyone is forbidden.')
                    .catch((e) => console.error('Error sending dm', e));
                break;
            default:
                await getChannel('log').send(`${message.member} was kicked`);
                await message.member.kick('Everyone ping spamming');
        }
    }
}

/**
 *
 * @param {import('discord.js').Client} client
 * @param {import('discord.js').Message} message
 * @return {Promise<void>}
 */
export async function messageCreate(client, message) {
    if (message.author.bot) return;
    // If this is a DM we can ignore these
    if (!message.guild) return;
    await handleSwearing(client, message);
    await handlePings(client, message);
}

/**
 *
 * @param {import('discord.js').Client} client
 * @param {import('discord.js').Message} oldMessage
 * @param {import('discord.js').Message} newMessage
 * @return {Promise<void>}
 */
export async function messageUpdate(client, oldMessage, newMessage) {
    return messageCreate(client, newMessage.partial ? await newMessage.fetch() : newMessage);
}
