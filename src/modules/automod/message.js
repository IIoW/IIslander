import Blacklist from '../../constants/Blacklist';
import { logMessages, swearWarning } from '../../constants/Messages';
import { xpCooldown } from '../../constants/Awards';
import { getUserMod } from '../../permissions';
import Mod from '../../constants/Mod';
import { penalize } from '../../modUtil';
import config from '../../config';
import { userDb } from '../../dbs';
import { getChannel } from '../../util';

/**
 * Checks if a message contains a swear
 * @param {import('discord.js').Message} message - The message to check
 * @return {[string, number]?} any match with the blacklist
 */
function containsSwear(message) {
    const words = message.content
        .toLowerCase()
        .replace(/[0ö]/g, 'o')
        .replace(/[1!|]/g, 'i')
        .replace(/3/g, 'e')
        .replace(/[4@ä]/g, 'a')
        .replace(/[5$]/g, 's')
        .replace(/[7+]/g, 't')
        .replace(/8/g, 'b')
        .replace(/\(/g, 'c')
        .replace(/ü/g, 'u')
        .replace(/[^a-z ]/g, '')
        .split(/(?:\b|\s)+/g);
    const word = words.find((w) => Blacklist.swearWords.find(([swear]) => w === swear));
    if (!word) return null;
    return Blacklist.swearWords.find(([swear]) => swear === word);
}

/**
 * @param {import('discord.js').Message} message
 * @return {Promise<void>}
 */
async function handleSwearing(message) {
    const [word, level] = containsSwear(message) || [];
    if (word) {
        const userDto = userDb.get(message.author.id);
        const now = Date.now();
        const cooldown = userDto.cooldown.get('swearing');
        if (now > (cooldown || 0)) {
            userDto.swearlevel = 0; // resets the swear level, if time ran out
        }
        userDto.swearlevel += level;
        userDto.cooldown.set('swearing', now + xpCooldown.swearing);
        userDb.set(message.author.id, userDto);
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
                        .replace('[match]', word)}`
                );
        }
        await getChannel('log').send(
            logMessages
                .get('swearing')
                .replace('[user]', message.member)
                .replace('[message]', message.content)
                .replace('[match]', word)
        );
    }
}

/**
 * @param {import('discord.js').Message} message
 * @return {Promise<void>}
 */
async function handlePings(message) {
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
 * @param {import('discord.js').Client} _
 * @param {import('discord.js').Message} message
 * @return {Promise<void>}
 */
export async function messageCreate(_, message) {
    if (message.author.bot) return;
    // If the message is outside of the default guild we can ignore it
    if (message.guild?.id !== config.defaultGuild) return;
    await handleSwearing(message);
    await handlePings(message);
}

/**
 *
 * @param {import('discord.js').Client} client
 * @param {import('discord.js').Message} oldMessage
 * @param {import('discord.js').Message} newMessage
 * @return {Promise<void>}
 */
export async function messageUpdate(client, oldMessage, newMessage) {
    if (
        !newMessage.author.bot &&
        newMessage.guild?.id === config.defaultGuild &&
        !containsSwear(oldMessage.partial ? await oldMessage.fetch() : oldMessage)
    ) {
        await handleSwearing(newMessage.partial ? await newMessage.fetch() : newMessage);
    }
}
