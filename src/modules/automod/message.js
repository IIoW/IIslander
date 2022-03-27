import { getChannel, userDb } from '../../util';
import { logMessages } from '../../constants/Messages';
import { xpCooldown } from '../../constants/Awards';
import { getUserMod } from '../../permissions';
import Mod from '../../constants/Mod';
import config from '../../config';

/**
 *
 * @param {import('discord.js').Client} client
 * @param {import('discord.js').Message} message
 * @return {Promise<void>}
 */
async function handlePings(client, message) {
    if (getUserMod(message.member) >= Mod.ENFORCER) return;
    if (message.content.match('@(everyone|here)')) {
        const userDto = userDb.get(message.author.id);
        const now = Date.now();
        const cooldown = userDto.cooldown.get('everyoneping');
        if (now > cooldown) {
            userDto.everyoneping = 0; // resets the ping counter, if time ran out
        }
        userDto.everyoneping += 1;
        await message.delete();
        userDto.cooldown.set('everyoneping', now + xpCooldown.everyoneping);
        userDb.set(message.author.id, userDto);
        await getChannel('log').send(
            logMessages
                .get('everyoneping')
                .replace('[user]', message.member)
                .replace('[message]', message.content)
        );
        switch (userDto.everyoneping) {
            case 1:
            case 2:
                await message.author
                    .send('Pinging everyone is forbidden.')
                    .catch((e) => console.error('Error sending dm', e));
                break;
            default:
                await getChannel('log').send(`${message.member} was kicked`);
                await message.member.kick('Everyone ping spamming');
        }
    }
}

/**
 *
 * @param {import('discord.js').Client} client
 * @param {import('discord.js').Message} message
 * @return {Promise<void>}
 */
export async function messageCreate(client, message) {
    if (message.author.bot) return;
    // If the message is outside of the default guild we can ignore it
    if (message.guild?.id !== config.defaultGuild) return;
    await handlePings(client, message);
}

/**
 *
 * @param {import('discord.js').Client} client
 * @param {import('discord.js').Message} oldMessage
 * @param {import('discord.js').Message} newMessage
 * @return {Promise<void>}
 */
export async function messageUpdate(client, oldMessage, newMessage) {
    await messageCreate(client, newMessage.partial ? await newMessage.fetch() : newMessage);
}
