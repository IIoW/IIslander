import { EmbedBuilder } from 'discord.js';
import { commands } from '../message';

export const command = 'help';
export const desc = 'Shows you this message.';

/**
 *
 * @param {import('discord.js').Client} client
 * @param {import('discord.js').Message} message
 * @return {Promise<void>}
 */
export async function fun(client, message) {
    const embed = new EmbedBuilder();
    commands.forEach((cmd, name) => {
        if (cmd.desc) embed.addFields({ name, value: cmd.desc });
    });
    embed.setTitle('DM Commands Help');
    embed.setColor('#c62828');
    await message.reply({ embeds: [embed] });
}
