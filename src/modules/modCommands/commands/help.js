import { MessageEmbed } from 'discord.js';
import { commands } from '../processCommands';

const info = {
    name: 'help',
    desc: 'Get help with commands!',
    level: 0,
};

/**
 *
 * @param {import('discord.js').Client} client
 * @param {import('discord.js').Message} message
 * @param {string[]} args
 * @param {number} level
 */
// eslint-disable-next-line no-unused-vars
async function fun(client, message, args, level) {
    const cmds = commands.filter((c) => c.info.level <= level);
    // If they can only run the help command just ignore them.
    if (cmds.size <= 1) return;
    const embed = new MessageEmbed()
        .setTitle('Moderator Commands')
        .addFields(
            cmds.map((c) => ({ name: `${c.info.name}:`, value: c.info.desc || 'No description.' }))
        );
    await message.reply({
        embeds: [embed],
    });
}

export { info, fun };
