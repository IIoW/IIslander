import ensureRoles from '../../../roles';
import { getMember, keyDb, userDb } from '../../../util';

const command = 'giveaway';

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
        const userDto = userDb.get(member.id);
        if (!userDto.steamVia) {
            if (!userDto.eligibleGiveaway) {
                await interaction.editReply({
                    content: 'You have not won a giveaway.',
                    components: [],
                });
            } else {
                const key = keyDb.random();
                if (!key) {
                    await interaction.editReply({
                        content:
                            "I'm sorry there doesn't seem to be any available keys. Please contact a developer.",
                        components: [],
                    });
                } else {
                    userDto.steamVia = key.value;
                    keyDb.delete(key.value);
                    userDb.set(member.id, userDto);
                    await interaction.editReply({
                        content: `You have claimed a key. Click the spoiler down below to view it.\n||${userDto.steamVia}||`,
                        components: [],
                    });
                    await ensureRoles(member);
                }
            }
        } else {
            await interaction.editReply({
                content: 'You already are a Steam Owner or have received a giveaway key.',
                components: [],
            });
        }
    } else {
        await interaction.update({ content: 'Ok, you have not received the key.', components: [] });
    }
}

export { command, fun };
