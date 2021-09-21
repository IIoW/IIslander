import { userDb } from '../../util';
import sendLevelNotification from './notifications';

async function addXp(member, xp) {
    const userDto = userDb.get(member.id);

    let oldLevel = userDto.level;

    userDto.xp += xp;

    const newLevel = userDto.level;

    if (newLevel !== oldLevel) {
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
    return true;
}

async function removeXp(member, xp) {
    // potentially add more functionality here
    return addXp(member, -xp);
}

export { addXp, removeXp };
