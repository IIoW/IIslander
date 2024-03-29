import Emotes from '../../constants/Emotes';
import { responseDb } from '../../dbs';
import { getChannel, makeTitle } from '../../util';

/**
 *
 * @param {import('discord.js').Client} client
 * @param {import('discord.js').Message} message
 * @return {Promise<void>}
 */
export async function messageCreate(client, message) {
    // No auto responses in dm's or to bots
    if (!message.guild || message.author.bot) return;
    if (message.channel.id !== getChannel('help').id && !message.mentions.has(client.user)) return;
    await Promise.all(
        responseDb.map(async (responseDto) => {
            const triggers = responseDto.trigger.some((trigger) =>
                trigger instanceof RegExp
                    ? message.content.match(trigger)
                    : message.content
                          .toLowerCase()
                          .match(
                              new RegExp(`\\b${trigger.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`)
                          )
            );
            if (triggers) {
                const msg = await message.channel.send(
                    `${makeTitle(responseDto.title)}\n\n${responseDto.response}`
                );
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
    let users;
    if (messageReaction.partial) {
        messageReaction = await messageReaction.fetch();
        users = await messageReaction.users.fetch();
    } else {
        users = messageReaction.users.cache;
    }
    if (user.partial) user = await user.fetch();
    if (
        messageReaction.message.author.id !== client.user.id ||
        user.id === client.user.id ||
        !users.has(client.user.id)
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
