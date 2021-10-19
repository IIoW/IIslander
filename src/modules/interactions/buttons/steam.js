import { getChannel, getMember, getRole } from '../../../util';

const command = 'steam';

/**
 *
 * @param {import('discord.js').Client} client
 * @param {import('discord.js').ButtonInteraction} interaction
 * @param {string[]} args
 */
async function fun(client, interaction, args) {
    if (args[1] === 'y') {
        await interaction.deferUpdate();
        const member = await getMember(args[0]);
        const role = getRole('steamowner');
        await member.roles.add(role);
        await interaction.editReply({ content: 'You got the role now.', components: [] });
        await getChannel('steam-owner').send(`Welcome ${member} to the Steam Owner's club!`);
    } else {
        await interaction.update({ content: 'Ok, you are not a steam owner.', components: [] });
    }
}

export { command, fun };
