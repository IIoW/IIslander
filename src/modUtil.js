import OffenseDescriptions from './constants/OffenseDescriptions';
import OffenseMultiplier from './constants/OffenseMultiplier';
import { getChannel, userDb } from './util';
import { getXpFromLevel, removeXp } from './xpHandling';

/**
 *
 * @param {import('discord.js').User} user - The user to penalize.
 * @param {string} type - The type of infraction.
 * @param {string} reason - The mod reason.
 */
async function penalize(user, type, reason) {
    const userDto = userDb.get(user.id);
    // TODO: xp deduction. Depends on feature/leveling branch.
    const recentOffences = userDto.offences.reduce((num, off) => {
        // If the offence happened in the last 24 hours
        if (off.time - Date.now() < 8.64e7) return num + 1;
        return num;
    }, 0);
    const xpDeduction = Math.round(
        (getXpFromLevel(userDto.level + 1) - getXpFromLevel(userDto.level)) *
            0.25 *
            OffenseMultiplier[type] *
            (recentOffences + 1)
    );
    userDto.offences.push({
        type: 'penalize',
        offence: type,
        modeReason: reason,
        xpDeduction,
        time: Date.now(),
    });
    let dmFailed = false;
    // const oldLevel = userDto.level;
    console.log(userDto.level);
    await removeXp(user, xpDeduction, true);
    console.log(userDto.level);
    try {
        await user.send(
            `You have been penalized for ${OffenseDescriptions[type]}. You have lost some XP and may have even dropped levels based on the severity and occurrence.`
        );
    } catch (e) {
        dmFailed = true;
    }
    try {
        // TODO: Use getChannel from feature/leveling branch.
        await getChannel('mod-list').send(
            `${user} offense #${userDto.offences.length}(${recentOffences + 1}) penalized for:\n${
                OffenseDescriptions[type]
            }\n${reason}${dmFailed ? "\nThis user was unable to be dm'ed." : ''}`,
            { allowedMentions: { users: [] } }
        );
    } catch (e) {
        console.log(`Error sending log message:\n${e.stack}`);
    }
    userDb.set(user.id, userDto);
}

// Disabled eslint here cause I will export other stuff
// in the future
// eslint-disable-next-line import/prefer-default-export
export { penalize };
