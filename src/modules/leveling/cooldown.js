import config from '../../config';
import { userDb } from '../../dbs';
import { getRole } from '../../util';

function emit(client, reactionName, userid) {
    client.emit('cooldownEnd', reactionName, userid);
}

export async function cooldownEnd(client, reactionName, userId) {
    const member = await (await client.guilds.fetch(config.defaultGuild)).members.fetch(userId);
    const role = getRole(`cooldown_${reactionName}`);
    // In cases where there is no role (swearing) or
    // you forgot a role in the .env.
    if (role) await member.roles.remove(role);
    const userDto = userDb.get(userId);
    userDto.cooldown.delete(reactionName);
    userDb.set(userId, userDto);
}

export async function restartCooldown(client) {
    const now = Date.now();
    userDb.forEach((userDto, id) => {
        userDto.cooldown.forEach((expires, name) => {
            const cooldown = expires - now;
            if (cooldown <= 0) {
                emit(client, name, id);
            } else {
                setTimeout(emit, cooldown, client, name, id);
            }
        });
    });
}
