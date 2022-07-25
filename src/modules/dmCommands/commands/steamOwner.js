import { ActionRowBuilder, ButtonBuilder, ButtonStyle } from 'discord.js';
import { userDb } from '../../../dbs';

export const command = 'steamowner';
export const desc = 'Show that you bought the game.';

/**
 *
 * @param {import('discord.js').Client} client
 * @param {import('discord.js').Message} message
 * @return {Promise<void>}
 */
export async function fun(client, message) {
    const userDto = userDb.get(message.author.id);
    if (userDto.steamVia) {
        await message.author.send('You already either have the giveaway or steamowner role.');
        return;
    }
    await message.author.send({
        content:
            'By becoming a steam owner, you state, that you **bought** the game.\n' +
            "Therefore you won't be able to participate in giveaways.",
        components: [
            new ActionRowBuilder().addComponents(
                new ButtonBuilder({
                    customId: `steam.${message.author.id}.y`,
                    style: ButtonStyle.Primary,
                    label: 'I want the role',
                }),
                new ButtonBuilder({
                    customId: `steam.${message.author.id}.n`,
                    style: ButtonStyle.Primary,
                    label: "Ok, I don't want it",
                })
            ),
        ],
    });
}
