import { getMember, getRole } from '../../../util';

const command = 'os';

/**
 *
 * @param {import('discord.js').Client} client
 * @param {import('discord.js').ButtonInteraction} interaction
 * @param {string[]} args
 */
async function fun(client, interaction, args) {
    const m = await getMember(args[0]);
    const role = getRole(args[1]);
    if (!m.roles.cache.has(role)) {
        await m.roles.add(role);
        await interaction.reply(`Ah nice! Another ${args[1]} user`);
    } else {
        await m.roles.remove(role);
        await interaction.reply(`So you are no longer using ${args[1]}. Thats fine.`);
    }
}

export { command, fun };
