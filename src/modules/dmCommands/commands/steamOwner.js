import { MessageActionRow, MessageButton } from 'discord.js';
import { getMember, getRole, userDb } from '../../../util';

export const command = 'steamowner';

/**
 *
 * @param {import('discord.js').Client} client
 * @param {import('discord.js').Message} message
 * @param {import('discord.js').GuildMember} member
 * @return {Promise<void>}
 */
export async function fun(client, message, member) {
    const role = getRole('steamowner');
    const userDto = userDb.get(message.author.id);
    if (userDto.steamVia) {
        await message.author.send('You already either have the giveaway or steamowner role.');
        return;
    }
    const filter = (i) => i.user.id === message.author.id;
    const collector = message.channel.createMessageComponentCollector({ filter, time: 30000 });
    await message.author.send({
        content:
            'By becoming steam owner, you state, that you **bought** the game.\n' +
            "Therefore you won't be able to participate in giveaways.",
        components: [
            new MessageActionRow().addComponents(
                new MessageButton({
                    customId: 'steamownerAccept',
                    style: 'PRIMARY',
                    label: 'I want the role',
                }),
                new MessageButton({
                    customId: 'steamownerDenied',
                    style: 'PRIMARY',
                    label: "Ok, i don't want it",
                })
            ),
        ],
    });
    collector.on('collect', async (i) => {
        console.log('Heeyyyyy click!!!!');
        if (i.customId === 'steamownerAccept') {
            await member.roles.add(role);
            userDto.steamVia = 'steamowner';
            userDb.set(message.author.id, userDto);
            i.reply('You got the role now.');
        }
        collector.stop('successful');
    });

    collector.on('end', () => {
        if (collector.total === 0) message.author.send('Time ran out');
        else console.log('successful');
    });
}
