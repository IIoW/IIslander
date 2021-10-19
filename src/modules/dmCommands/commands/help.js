import { MessageEmbed } from 'discord.js';
import { commands } from '../message';

export const command = 'help';
export const desc = 'Shows you this message';

/**
 *
 * @param {import('discord.js').Client} client
 * @param {import('discord.js').Message} message
 * @param {import('discord.js').GuildMember} member
 * @return {Promise<void>}
 */
export async function fun(client, message) {
    const embed = new MessageEmbed();
    commands.forEach((cmd, name) => {
        console.log(cmd);
        if (cmd.desc) embed.addField(name, cmd.desc);
    });
    embed.setTitle('DM Commands Help');
    embed.setColor('#c62828');
    await message.reply({ embeds: [embed] });
}
