import config from '../../config';
import Emotes from '../../constants/Emotes';
import { pin } from '../../permissions';
import { getMember } from '../../util';

/**
 *
 * @param {import('discord.js').Client} client
 * @param {import('discord.js').MessageReaction} messageReaction
 * @param {import('discord.js').User} user
 * @return {Promise<void>}
 */
export default async function messageReactionAdd(client, messageReaction, user) {
    let users;
    let msg;
    if (messageReaction.partial) {
        messageReaction = await messageReaction.fetch();
        msg = await messageReaction.message.fetch();
        users = await messageReaction.users.fetch();
    } else {
        users = messageReaction.users.cache;
        msg = messageReaction.message;
    }
    if (user.partial) user = await user.fetch();
    if (user.id === client.user.id || msg.guildId !== config.defaultGuild) return;
    switch (messageReaction.emoji.name) {
        case Emotes.pin:
            if (!pin(await getMember(user.id))) {
                await messageReaction.users.remove(user);
                return;
            }
            if (msg.pinned) {
                await msg.unpin();
                if (users.has(client.user.id)) await messageReaction.users.remove();
                await messageReaction.users.remove(user);
            } else {
                await msg.pin();
                await msg.react(Emotes.pin);
                await messageReaction.users.remove(user);
            }
            break;
        default:
            break;
    }
}
