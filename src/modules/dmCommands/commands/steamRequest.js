import { MessageActionRow, MessageButton } from 'discord.js';
import { userDb } from '../../../util';

export const command = 'steamrequest';
export const desc = "Receive a key if you've won one.";

/**
 *
 * @param {import('discord.js').Client} client
 * @param {import('discord.js').Message} message
 * @param {import('discord.js').GuildMember} member
 * @return {Promise<void>}
 */
export async function fun(client, message) {
    const userDto = userDb.get(message.author.id);
    if (userDto.steamVia === 'owner') {
        await message.author.send('You already are a steam owner! You cannot receive a key!');
        return;
    }
    if (userDto.steamVia) {
        await message.author.send(
            `You have already claimed a key. Click the spoiler down below to view it.\n||${userDto.steamVia}||`
        );
        return;
    }
    if (!userDto.eligibleGiveaway) {
        await message.author.send(`I'm sorry, you have not been awarded a key request or a key.`);
        return;
    }
    await message.author.send({
        content:
            `You have a key that can be claimed from **Giveaway #${userDto.eligibleGiveaway}**. ` +
            'By requesting a key, you are unable to declare yourself as an owner of the game to receive a special honorary role in the server. ' +
            'If you still want to confirm your request, click the `I want the key` button. ' +
            "If you want to declare yourself an owner of the game and forgo this key, click the `Ok, I don't want it` button and then type `steamowner`.",
        components: [
            new MessageActionRow().addComponents(
                new MessageButton({
                    customId: `giveaway.${message.author.id}.y`,
                    style: 'PRIMARY',
                    label: 'I want the key',
                }),
                new MessageButton({
                    customId: `giveaway.${message.author.id}.n`,
                    style: 'PRIMARY',
                    label: "Ok, I don't want it",
                })
            ),
        ],
    });
}
