import OffenseDescriptions from './constants/OffenseDescriptions';
import OffenseMultiplier from './constants/OffenseMultiplier';
import OffenceDto from './dto/OffenceDto';
import { getChannel, userDb } from './util';
import { getXpFromLevel, removeXp } from './xpHandling';

/**
 * Information about different mod actions.
 */
const actionTypes = {
    penalize: {
        display: 'penalized',
        xpDeduction: true,
    },
    warn: {
        display: 'warned',
        xpDeduction: false,
    },
};
/**
 * Internal function for shared code between mod actions.
 */
async function modActionCore({ user, type, reason, actionType } = {}) {
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
    userDto.offences.push(new OffenceDto(actionType, type, reason, xpDeduction, Date.now()));
    let dmFailed = false;
    // Have to set the thing before removing xp or
    // else it overwrites with the old numbers.
    userDb.set(user.id, userDto);
    if (action.xpDeduction) await removeXp(user, xpDeduction, true);
    try {
        await user.send(
            `You have been ${action.display} for ${OffenseDescriptions[type]}. You have lost some XP and may have even dropped levels based on the severity and occurrence.`
        );
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
                          userDto.xp - xpDeduction < 0 ? 0 : userDto.xp - xpDeduction < 0
                      } [${xpDeduction}]`
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

export { penalize, warn };
