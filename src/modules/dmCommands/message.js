import { Collection } from 'discord.js';
import fs from 'fs/promises';
import { getChannel, getMember } from '../../util';

const commands = new Collection()

/**
 *
 * @param {import('discord.js').Client} client
 * @param {import('discord.js').Message} message
 */

export async function messageCreate(client, message) {
    console.log(message.member)
    if (message.guild !== null || message.author.bot) return; // DM Only
    const member = getMember(message.author.id)
    console.log(member) // this has no id attribute for some reason
    if (member == null) return; // Ensures being a discord member

    const {content} = message
    const command = content.split(' ')[0]
    const cmd = commands.get(command)
    if (!cmd) return;
    await cmd(client, message, member)
}

export async function ready() {
    console.log('Loading dm commands...');

    const commandModules = await fs.readdir('./src/modules/dmCommands/commands');

    await Promise.all(
        commandModules.map(async (moduleName) => {
            if (moduleName.endsWith('.js')) {
                const module = await import(`./commands/${moduleName}`);
                commands.set(module.command, module.fun);
            }
        })
    );
    console.log(
        `loaded commands:\n\t${Array.from(commands.keys()).join('\n\t')}`
    );
    console.log('Finished loading dm commands');
}

