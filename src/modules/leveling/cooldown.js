import { getRole } from '../../util';
import config from '../../config';

export default async function cooldownEnd(client, reactionName, userid) {
    const member = await (await client.guilds.fetch(config.defaultGuild)).members.fetch(userid);
    await member.roles.remove(getRole(`cooldown_${reactionName}`));
}
