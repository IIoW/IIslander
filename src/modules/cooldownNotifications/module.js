import { getEmoji, getMember, getRole } from '../../util';
import { cooldownEndMessages } from '../../constants/Messages';

const enabled = true;

const subscriptions = new Map();

subscriptions.set('cooldownEnd', async (client, reactionName, userid) => {
    if (!(await getMember(userid)).roles.cache.has(getRole('notifications_cooldown'))) return;
    await (
        await client.users.fetch(userid)
    ).send(
        cooldownEndMessages[Math.floor(Math.random() * cooldownEndMessages.length)].replace(
            '[role]',
            getEmoji(reactionName)
        )
    );
});

export { enabled, subscriptions };
