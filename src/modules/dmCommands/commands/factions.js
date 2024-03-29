import { ActionRowBuilder, ButtonBuilder, ButtonStyle } from 'discord.js';
import Factions from '../../../constants/Factions';
import { userDb } from '../../../dbs';
import { getEmoji } from '../../../util';

export const command = 'factions';
export const desc = 'Shows an overview over the factions and lets you join them.';

/**
 *
 * @param {import('discord.js').Client} client
 * @param {import('discord.js').Message} message
 * @return {Promise<void>}
 */
export async function fun(client, message) {
    const userDto = userDb.get(message.author.id);
    if (userDto.faction) {
        await message.author.send('You are already in a faction. Switching is not allowed.');
        return;
    }
    await message.author.send({
        content: `There are the following factions:\n${Object.values(Factions)
            .map((f) => f.fullName)
            .join(
                ', '
            )}\nTo join one of them, in case you aren't in a faction already, click the buttons below.`,
        components: [
            new ActionRowBuilder().addComponents(
                Object.entries(Factions).map(
                    ([name, faction]) =>
                        new ButtonBuilder({
                            customId: `faction.${message.author.id}.${name}`,
                            style: ButtonStyle.Primary,
                            emoji: getEmoji(faction.emote).id,
                            label: faction.fullName,
                        })
                )
            ),
        ],
    });
}
