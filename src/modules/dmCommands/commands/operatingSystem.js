import { MessageActionRow, MessageButton } from 'discord.js';

export const command = 'os';
export const desc = 'Tell us which Operating System you are using';

/**
 *
 * @param {import('discord.js').Client} client
 * @param {import('discord.js').Message} message
 * @param {import('discord.js').GuildMember} member
 * @return {Promise<void>}
 */
export async function fun(client, message) {
    await message.author.send({
        content:
            'People play on different OS. To show, which one you are using, select the most according down below.',
        components: [
            new MessageActionRow().addComponents(
                new MessageButton({
                    customId: `os.${message.author.id}.windows`,
                    style: 'PRIMARY',
                    label: 'Windows (as useful as in space)',
                }),
                new MessageButton({
                    customId: `os.${message.author.id}.linux`,
                    style: 'PRIMARY',
                    label: 'Linux (penguin gang)',
                }),
                new MessageButton({
                    customId: `os.${message.author.id}.mac`,
                    style: 'PRIMARY',
                    label: 'Mac (with cheese please)',
                })
            ),
        ],
    });
}
