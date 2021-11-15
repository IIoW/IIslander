import { getChannel, getMember, getRole, userDb } from '../../../util';

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
        const userDto = await userDb.get(member.id);
        if (!userDto.steamVia) {
            userDto.steamVia = 'owner';
            userDb.set(member.id, userDto);
            const role = getRole('steamowner');
            await member.roles.add(role);
            await interaction.editReply({ content: 'You got the role now.', components: [] });
            await getChannel('steam-owner').send(`Welcome ${member} to the Steam Owner's club!`);
        } else {
            await interaction.editReply({
                content: 'You already are a Steam Owner or have received a giveaway key.',
                components: [],
            });
        }
    } else {
        await interaction.update({ content: 'Ok, you are not a steam owner.', components: [] });
    }
}

export { command, fun };
