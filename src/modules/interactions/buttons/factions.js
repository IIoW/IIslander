import { getChannel, getMember, sanitizeUserInput, userDb } from '../../../util';
import Factions from '../../../constants/Factions';

const command = 'faction';

/**
 *
 * @param {import('discord.js').Client} client
 * @param {import('discord.js').ButtonInteraction} interaction
 * @param {string[]} args
 */
async function fun(client, interaction, args) {
    const userDto = userDb.get(args[0]);
    if (userDto.faction !== '')
        return interaction.reply('You are already in a faction. Switching is not allowed.');

    const faction = Factions[args[1]];
    const member = await getMember(args[0]);
    const { role } = faction;
    await member.roles.add(role);
    // eslint-disable-next-line prefer-destructuring
    userDto.faction = args[1];
    userDb.set(args[0], userDto);

    await getChannel('faction-chat').send(
        `${member} has joined the ${
            faction.fullName
        }! Check out your faction chat: ${client.channels.cache.get(faction.channels.chat)}!`
    );

    await client.channels.cache
        .get(faction.channels.chat)
        .send(`Welcome to the ${faction.fullName}, ${sanitizeUserInput(member.displayName)}`);

    return interaction.reply({
        content: faction.joinMessages[Math.floor(Math.random() * faction.joinMessages.length)],
    });
}

export { command, fun };
