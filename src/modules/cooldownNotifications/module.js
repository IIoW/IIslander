import { getEmoji, userDb } from '../../util';
import { cooldownEndMessages } from '../../constants/Messages';

const enabled = true;

const subscriptions = new Map();

subscriptions.set('cooldownEnd', async (client, reactionName, userid) => {
    const userDto = userDb.get(userid);
    if (!userDto.notifications.get('cooldownEnd')) return;
    // Prevents non-crystal cooldowns from being sent.
    if (!/tier\d\w+/.test(reactionName)) return;
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
