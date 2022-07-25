import { EmbedBuilder } from 'discord.js';
import {
    emojiStarBotRequired,
    emojiStarValue,
    starBoardThreshold,
} from '../../../constants/Awards';
import Emotes from '../../../constants/Emotes';
import { getChannel } from '../../../util';

const starboardSet = new Set();
/**
 *
 * @param {import('discord.js').Message} message
 * @return {number}
 */
function messageGetStarValue(message) {
    let points = 0;

    const reactionCache = message.reactions.cache.values();

    for (const messageReaction of reactionCache) {
        const emojiName = messageReaction.emoji.name;

        if (emojiName in emojiStarValue) {
            const reactionCount =
                messageReaction.count -
                messageReaction.users.cache.has(messageReaction.client.user.id);

            if (
                emojiStarBotRequired[emojiName]
                    ? messageReaction.users.cache.has(messageReaction.client.user.id)
                    : true
            ) {
                points += emojiStarValue[emojiName] * reactionCount;
            }
        }
    }
    return points;
}

/**
 *
 * @param {import('discord.js').Message} message
 * @return {Promise<void>}
 */
export default async function updateBoard(message) {
    const starBoardValue = messageGetStarValue(message);
    if (
        starBoardValue > starBoardThreshold &&
        !message.reactions.cache.get(Emotes.star)?.me &&
        !starboardSet.has(message.id)
    ) {
        starboardSet.add(message.id);
        await message.react(Emotes.star);
        const embed = new EmbedBuilder()
            .setTitle(message.member.displayName)
            .setThumbnail(message.author.avatarURL())
            .setColor(message.member.displayHexColor)
            .setDescription(`${message.content} \n\n ${message.url}`)
            .setImage(message.attachments.first()?.url);
        await getChannel('starboard').send({ embeds: [embed] });
    }
}
