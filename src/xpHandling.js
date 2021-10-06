import { userDb } from './util';
import sendLevelNotification from './notifications';

/**
 * @return {Promise<void>}
 */
async function addXp(member, xp, silent = false) {
    const userDto = userDb.get(member.id);

    let oldLevel = userDto.level;

    userDto.xp += xp;

    if (userDto.xp < 0) userDto.xp = 0;

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
    userDb.set(member.id, userDto);
}

async function removeXp(member, xp, silent) {
    // potentially add more functionality here
    return addXp(member, -xp, silent);
}

function getXpFromLevel(level) {
    return Math.floor((100 / 2.2) * level ** 2.2);
}

export { addXp, removeXp, getXpFromLevel };
