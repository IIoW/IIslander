import config from '../../config';
import { twitterMessages } from '../../constants/Messages';

const subscriptions = new Map();

subscriptions.set('messageCreate', async (client, message) => {
    const tChannel = config.channels.get('tweets');
    const tRole = config.roles.get('tweets');
    if (
        message.channel.id !== tChannel ||
        !message.author.bot ||
        message.author.id === client.user.id
    )
        return;
    await client.channels.cache
        .get(tChannel)
        .send(
            twitterMessages[Math.floor(Math.random() * twitterMessages.length)].replace(
                '[role]',
                `<@&${tRole}>`
            )
        );
});

const enabled = true;

export { subscriptions, enabled };
