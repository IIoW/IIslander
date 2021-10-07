import { getRole, userDb } from '../../util';
import config from '../../config';

function emit(client, reactionName, userid) {
    client.emit('cooldownEnd', reactionName, userid);
}

export async function cooldownEnd(client, reactionName, userid) {
    const member = await (await client.guilds.fetch(config.defaultGuild)).members.fetch(userid);
    await member.roles.remove(getRole(`cooldown_${reactionName}`));
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
