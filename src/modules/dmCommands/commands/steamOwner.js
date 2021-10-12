import { MessageActionRow, MessageButton } from 'discord.js';
import { userDb } from '../../../util';

export const command = 'steamowner';

/**
 *
 * @param {import('discord.js').Client} client
 * @param {import('discord.js').Message} message
 * @param {import('discord.js').GuildMember} member
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
            'By becoming steam owner, you state, that you **bought** the game.\n' +
            "Therefore you won't be able to participate in giveaways.",
        components: [
            new MessageActionRow().addComponents(
                new MessageButton({
                    customId: `steam.${message.author.id}.y`,
                    style: 'PRIMARY',
                    label: 'I want the role',
                }),
                new MessageButton({
                    customId: `steam.${message.author.id}.n`,
                    style: 'PRIMARY',
                    label: "Ok, i don't want it",
                })
            ),
        ],
    });
}