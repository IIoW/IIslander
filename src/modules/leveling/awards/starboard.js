import { MessageEmbed } from 'discord.js';
import {
    emojiStarBotRequired,
    emojiStarValue,
    starBoardThreshold,
} from '../../../constants/Awards';
import Emotes from '../../../constants/Emotes';
import { getChannel } from '../../../util';

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
            const reactionCount = messageReaction.count - messageReaction.me;

            if (emojiStarBotRequired[emojiName] ? messageReaction.me : true) {
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
    if (starBoardValue > starBoardThreshold && !message.reactions.cache.get(Emotes.star)?.me) {
        await message.react(Emotes.star);
        const embed = new MessageEmbed()
            .setTitle(message.member.displayName)
            .setThumbnail(message.author.avatarURL())
            .setColor(message.member.displayHexColor)
            .setDescription(`${message.content} \n\n ${message.url}`)
            .setImage(message.attachments.first()?.url);
        await getChannel('starboard').send({ embeds: [embed] });
    }
}
