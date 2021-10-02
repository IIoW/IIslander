import { responseDb } from '../../util';
import Emotes from '../../constants/Emotes';

/**
 *
 * @param {import('discord.js').Client} client
 * @param {import('discord.js').Message} message
 * @return {Promise<void>}
 */
export async function messageCreate(client, message) {
    await Promise.all(
        responseDb.map(async (responseDto) => {
            const triggers = responseDto.trigger.some((trigger) =>
                responseDto.isRegex
                    ? message.content.toLowerCase().match(trigger)
                    : message.content.toLowerCase().includes(trigger)
            );
            if (triggers) {
                const msg = await message.channel.send(responseDto.response);
                await msg.react(Emotes.thumbUp);
                await msg.react(Emotes.boom);
            }
        })
    );
}

/**
 *
 * @param {import('discord.js').Client} client
 * @param {import('discord.js').MessageReaction} messageReaction
 * @param {import('discord.js').User} user
 * @return {Promise<void>}
 */
export async function messageReactionAdd(client, messageReaction, user) {
    if (
        messageReaction.message.author !== client.user ||
        user === client.user ||
        !messageReaction.me
    )
        return;
    switch (messageReaction.emoji.name) {
        case Emotes.boom:
            await messageReaction.message.delete();
            break;
        case Emotes.thumbUp:
            await messageReaction.message.reactions.removeAll();
            break;
        default:
            break;
    }
}
