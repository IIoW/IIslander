import Blacklist from '../../constants/Blacklist';
import { logMessages, swearWarning } from '../../constants/Messages';
import { xpCooldown } from '../../constants/Awards';
import { getUserLevel, getUserMod } from '../../permissions';
import Mod from '../../constants/Mod';
import { penalize, timeout } from '../../modUtil';
import config from '../../config';
import { userDb } from '../../dbs';
import { getChannel } from '../../util';
import Levels from '../../constants/Levels';

/**
 * Checks if a message contains a swear
 * @param {import('discord.js').Message} message - The message to check
 * @return {[string, number][]?} any match with the blacklist
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
    const swears = words.reduce((acc, word) => {
        if (Blacklist.swearWords.has(word)) {
            acc.push([word, Blacklist.swearWords.get(word)]);
        }
        return acc;
    }, []);
    return swears.length ? swears.sort((a, b) => b[1] - a[1]) : null;
}

/**
 * @param {import('discord.js').Message} message
 * @return {Promise<void>}
 */
async function handleSwearing(message) {
    if (getUserMod(message.member) >= Mod.ENFORCER) return;
    const swears = containsSwear(message) || [];
    if (swears.length) {
        const userDto = userDb.get(message.author.id);
        const now = Date.now();
        const cooldown = userDto.cooldown.get('swearing');
        if (now > (cooldown || 0)) {
            userDto.swearlevel = 0; // resets the swear level, if time ran out
        }
        const level = swears.reduce((acc, [, count]) => acc + count, 0);
        userDto.swearlevel += level;
        userDto.cooldown.set('swearing', now + xpCooldown.swearing);
        userDb.set(message.author.id, userDto);
        const friendlyDisplay = `${swears[0][0]}${
            swears.length > 1
                ? ` + ${swears.length - 1} other${swears.length === 2 ? '' : 's'}`
                : ''
        }`;
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
            case 3:
                await penalize(
                    message.author,
                    'SWEARING',
                    `[automod] ${logMessages
                        .get('swearing')
                        .replace('[user]', message.member)
                        .replace('[message]', message.content)
                        .replace('[match]', friendlyDisplay)
                        .replace('[level]', userDto.swearlevel)}`
                );
                break;
            default:
                await timeout(
                    message.author,
                    'SWEARING',
                    `[automod] ${logMessages
                        .get('swearing')
                        .replace('[user]', message.member)
                        .replace('[message]', message.content)
                        .replace('[match]', friendlyDisplay)
                        .replace('[level]', userDto.swearlevel)}`,
                    Blacklist.swearTimeout
                );
        }
        await getChannel('log').send(
            logMessages
                .get('swearing')
                .replace('[user]', message.member)
                .replace('[message]', message.content)
                .replace('[match]', friendlyDisplay)
                .replace('[level]', userDto.swearlevel)
        );
        if (level >= 3) {
            await message.delete();
        }
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

let inviteCache = [0, new Map()];
/**
 * @param {import('discord.js').Guild} guild
 */
const getInvites = async (guild) => {
    const now = Date.now();
    if (now - inviteCache[0] > 1000 * 60 * 60) {
        // 1 hour
        inviteCache = [now, new Map()];
        const invites = await guild.invites.fetch();
        invites.forEach((invite) => inviteCache[1].set(invite.code, invite));
    }
    return inviteCache[1];
};

const inviteRegex =
    /(?:discord\.gg|discordapp\.com\/invite|discord\.com\/invite)\s*\/\s*([a-zA-Z0-9-]+)/gi;
/**
 * @param {import('discord.js').Message} message
 * @return {Promise<void>}
 */
async function handleInvites(message) {
    const { user: userLevel, mod } = getUserLevel(message.member);
    if (mod >= Mod.ENFORCER) return;
    if (userLevel >= Levels.LEGENDARY) return;
    const matchedInvites = [...message.content.matchAll(inviteRegex)];
    if (!matchedInvites.length) return;
    const invites = await getInvites(message.guild);
    let valid = true;
    const matchedCodes = new Set();
    for (const [, code] of matchedInvites) {
        if (!invites.has(code)) {
            valid = false;
            matchedCodes.add(code);
        }
    }
    if (valid) return;
    const userDto = userDb.get(message.author.id);
    const now = Date.now();
    const cooldown = userDto.cooldown.get('inviteSend');
    if (now > cooldown) {
        userDto.inviteSend = 0; // resets the invite counter, if time ran out
    }
    userDto.inviteSend += 1;
    await message.delete();
    userDto.cooldown.set('inviteSend', now + xpCooldown.inviteSend);
    userDb.set(message.author.id, userDto);
    await getChannel('log').send(
        logMessages
            .get('inviteSend')
            .replace('[user]', message.member)
            .replace('[message]', message.content)
            .replace('[invites]', Array.from(matchedCodes).join(', '))
    );
    switch (userDto.inviteSend) {
        case 1:
        case 2:
            await message.author
                .send(
                    'You are unable to send invites. If you believe that your invite will be beneficial to the server, please contact a moderator. Repeat offenders will be punished.'
                )
                .catch((e) => console.error('Error sending dm', e));
            break;
        default:
            await timeout(
                message.author,
                'ADVERTISE',
                '[automod] User send too many invites',
                /* 24 hours */ 60 * 24
            );
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
    await handleInvites(message);
}

/**
 *
 * @param {import('discord.js').Client} client
 * @param {import('discord.js').Message} oldMessage
 * @param {import('discord.js').Message} newMessage
 * @return {Promise<void>}
 */
export async function messageUpdate(client, oldMessage, newMessage) {
    if (newMessage.partial) await newMessage.fetch();
    if (
        !newMessage.author.bot &&
        newMessage.guild?.id === config.defaultGuild &&
        !containsSwear(oldMessage.partial ? await oldMessage.fetch() : oldMessage)
    ) {
        await handleSwearing(newMessage);
    }
}
