import { Collection } from 'discord.js';
import fs from 'fs/promises';
import { getMember } from '../../util';

export const commands = new Collection();

/**
 *
 * @param {import('discord.js').Client} client
 * @param {import('discord.js').Message} message
 */

export async function messageCreate(client, message) {
    if (message.guild !== null || message.author.bot) return; // DM Only
    const member = await getMember(message.author.id);
    if (member == null) return; // Ensures being a discord member

    const cmd = commands.get(message.content);
    if (!cmd) return;
    await cmd.fun(client, message, member);
}

export async function ready() {
    console.log('Loading dm commands...');

    const commandModules = await fs.readdir('./src/modules/dmCommands/commands');

    await Promise.all(
        commandModules.map(async (moduleName) => {
            if (moduleName.endsWith('.js')) {
                const module = await import(`./commands/${moduleName}`);
                commands.set(module.command, module);
            }
        })
    );
    console.log(`loaded commands:\n\t${Array.from(commands.keys()).join('\n\t')}`);
    console.log('Finished loading dm commands');
}
