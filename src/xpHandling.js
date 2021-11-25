import { getTomorrow, userDb } from './util';
import sendLevelNotification from './notifications';
import ensureRoles from './roles';

/**
 * @return {Promise<void>}
 */
async function addXp(member, xp, silent = false) {
    // Prevent invalid xp from getting set.
    // If NaN was passed the db value would be
    // set to NaN reseting a user's xp.
    if (typeof xp !== 'number' || Number.isNaN(xp)) return;

    const userDto = userDb.get(member.id);

    let oldLevel = userDto.level;

    userDto.xp += xp;

    if (userDto.xp < 0) userDto.xp = 0;

    userDto.xp = Math.round(userDto.xp);

    const newLevel = userDto.level;

    if (newLevel !== oldLevel && !silent) {
        if (xp > 0) {
            while (oldLevel !== newLevel) {
                // Disabled to keep the notifications in the correct order.
                // eslint-disable-next-line no-await-in-loop
                await sendLevelNotification(member, oldLevel + 1);
                oldLevel += 1;
            }
        } else {
            member
                .send('Sadly, some of your previous actions resulted in you loosing a level.')
                .catch((e) => console.error('Error sending level down dm!', e));
        }
    }

    // Ensure recent xp.
    if (userDto.activityValidUntil < Date.now()) {
        userDto.activityRecent = 0;
        userDto.activityValidUntil = getTomorrow();
    }
    userDto.activityRecent += xp;

    userDb.set(member.id, userDto);

    // Ensure the user has the right roles.
    await ensureRoles(member);
}

async function removeXp(member, xp, silent) {
    // potentially add more functionality here
    return addXp(member, -xp, silent);
}

function getXpFromLevel(level) {
    return Math.floor((100 / 2.2) * level ** 2.2);
}

export { addXp, removeXp, getXpFromLevel };
