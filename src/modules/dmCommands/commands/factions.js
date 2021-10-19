import { MessageActionRow, MessageButton } from 'discord.js';
import { getEmoji, userDb } from '../../../util';
import Factions from '../../../constants/Factions';

export const command = 'factions';
export const desc = 'Shows an overview over the factions and lets you join them.';

/**
 *
 * @param {import('discord.js').Client} client
 * @param {import('discord.js').Message} message
 * @param {import('discord.js').GuildMember} member
 * @return {Promise<void>}
 */
export async function fun(client, message) {
    const userDto = userDb.get(message.author.id);
    if (userDto.faction) {
        await message.author.send('Are already in a faction. Switching is not allowed');
        return;
    }
    await message.author.send({
        content: `There are the following factions:\n${Object.values(Factions)
            .map((f) => f.fullName)
            .join(
                ', '
            )}\nTo join one of them, in case you aren't in a faction already, click the buttons below`,
        components: [
            new MessageActionRow().addComponents(
                Object.entries(Factions).map(
                    ([name, faction]) =>
                        new MessageButton({
                            customId: `faction.${message.author.id}.${name}`,
                            style: 'PRIMARY',
                            emoji: getEmoji(faction.emote),
                            label: faction.fullName,
                        })
                )
            ),
        ],
    });
}
