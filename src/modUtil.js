import config from './config';
import OffenseDescriptions from './constants/OffenseDescriptions';
import OffenseMultiplier from './constants/OffenseMultiplier';
import OffenceDto from './dto/OffenceDto';
import { getAndAddRole, getChannel, stringifyTimestamp, userDb } from './util';
import { getXpFromLevel, removeXp } from './xpHandling';

/**
 * Information about different mod actions.
 */
const actionTypes = {
    penalize: {
        display: 'penalized',
        xpDeduction: true,
        timeout: false,
        message: (desc) =>
            `You have been penalized for ${desc}. You have lost some XP and may have even dropped levels based on the severity and occurrence.`,
    },
    warn: {
        display: 'warned',
        xpDeduction: false,
        timeout: false,
        message: (desc) =>
            `You have received a warning for ${desc}. You have not been penalized, however future violations may result in penalties.`,
    },
    timeout: {
        display: 'timed out',
        xpDeduction: true,
        timeout: true,
        message: (desc, time) =>
            `You have been placed on timeout that will end in approximately ${stringifyTimestamp(
                time,
                'R'
            )} for ${desc}. You will be unable to interact with the server during this time.`,
    },
};
/**
 * Internal function for shared code between mod actions.
 * @param {object} options - The options for the mod action.
 * @param {import('discord.js').User} options.user - The user to penalize.
 * @param {string} options.type - The type of mod action.
 * @param {string} options.reason - The mod reason.
 * @param {string} options.actionType - The type of mod action.
 * @param {number} [options.timeoutDuration] - The duration of the timeout, in milliseconds. Defaults to 24 hours.
 * @returns {Promise<void>}
 */
async function modActionCore({ user, type, reason, actionType, timeoutDuration = 3.6e6 } = {}) {
    const action = actionTypes[actionType];
    if (!action) throw new Error(`Unknown action type "${actionType}"`);
    const userDto = userDb.get(user.id);
    const recentOffences = userDto.offences.reduce((num, off) => {
        if (off.isRecent) return num + 1;
        return num;
    }, 1);
    const xpDeduction = action.xpDeduction
        ? Math.round(
              (getXpFromLevel(userDto.level + 1) - getXpFromLevel(userDto.level)) *
                  0.25 *
                  OffenseMultiplier[type] *
                  recentOffences
          )
        : null;
    const endTime = action.timeout ? Date.now() + timeoutDuration : null;
    userDto.offences.push(
        new OffenceDto(actionType, type, reason, xpDeduction, Date.now(), endTime)
    );
    // Timeout handling
    if (action.timeout) {
        // Maybe make this a function thats shared
        // between awards and this later
        userDto.cooldown.set('timeout', endTime);
        const member = await user.client.guilds.cache
            .get(config.defaultGuild)
            .members.fetch(user.id);
        await getAndAddRole(member, 'cooldown_timeout');
        setTimeout(() => user.client.emit('cooldownEnd', 'timeout', user.id), timeoutDuration);
    }
    // Have to set the thing before removing xp or
    // else it overwrites with the old numbers.
    userDb.set(user.id, userDto);
    // XP handling
    if (action.xpDeduction) await removeXp(user, xpDeduction, true);
    let dmFailed = false;
    try {
        await user.send(action.message(OffenseDescriptions[type], endTime));
    } catch (e) {
        dmFailed = true;
    }
    try {
        await getChannel('log').send(
            `${user} offense #${userDto.offences.length}(${recentOffences}) ${
                action.display
            } for:\n${OffenseDescriptions[type]}${
                dmFailed ? "\nThis user was unable to be dm'ed." : ''
            }${
                action.xpDeduction
                    ? `\nXP: ${userDto.xp} > ${
                          userDto.xp - xpDeduction < 0 ? 0 : userDto.xp - xpDeduction
                      } [${xpDeduction}]`
                    : ''
            }${
                action.timeout
                    ? `\nEnds: ${stringifyTimestamp(endTime)} (${stringifyTimestamp(endTime, 'R')})`
                    : ''
            }\n${reason}`,
            { allowedMentions: { users: [] } }
        );
    } catch (e) {
        console.log(`Error sending log message:\n${e.stack}`);
    }
}
/**
 *
 * @param {import('discord.js').User} user - The user to penalize.
 * @param {string} type - The type of infraction.
 * @param {string} reason - The mod reason.
 */
async function penalize(user, type, reason) {
    return modActionCore({ user, type, reason, actionType: 'penalize' });
}

/**
 *
 * @param {import('discord.js').User} user - The user to penalize.
 * @param {string} type - The type of infraction.
 * @param {string} reason - The mod reason.
 */
async function warn(user, type, reason) {
    return modActionCore({ user, type, reason, actionType: 'warn' });
}

/**
 *
 * @param {import('discord.js').User} user - The user to penalize.
 * @param {string} type - The type of infraction.
 * @param {string} reason - The mod reason.
 * @param {number} time - The duration of the timeout, in minutes.
 */
async function timeout(user, type, reason, time) {
    return modActionCore({
        user,
        type,
        reason,
        actionType: 'timeout',
        timeoutDuration: time * 60000,
    });
}

/**
 * Clean up a user's nickname.
 * @param {string} nick - The nick to clean.
 * @returns {string} A cleaned nickname.
 */
const cleanNickname = (nick) => nick.replace(/[^a-zA-Z0-9_ .]/g, '').slice(0, 32);

export { penalize, warn, timeout, cleanNickname };
