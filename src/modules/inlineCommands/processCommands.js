import { Collection } from 'discord.js';
import fs from 'fs/promises';

const commands = new Collection();

async function loadCommands() {
    console.log('Loading inline commands...');

    const commandModules = await fs.readdir('./src/modules/inlineCommands/commands');

    await Promise.all(
        commandModules.map(async (moduleName) => {
            if (moduleName.endsWith('.js')) {
                const module = await import(`./commands/${moduleName}`);
                commands.set(module.command, module.fun);
            }
        })
    );
    console.log(
        `loaded commands:\n\t${Array.from(commands.keys())
            .map((v) => v.toString().replace(/^\/?<(.+)>\/?$/, '$1'))
            .join('\n\t')}`
    );
    console.log('Finished loading inline commands');
}

/**
 *
 * @param {import('discord.js').Client} client
 * @param {import('discord.js').Message} message
 */
async function processCommandsNewMessage(client, message) {
    // Avoid botception
    if (message.author.bot) return;
    await Promise.all(
        commands.map((fun, command) => {
            if (message.content.match(command) !== null) {
                return fun(client, message);
            }
            return undefined;
        })
    );
}

/**
 *
 * @param {import('discord.js').Client} client
 * @param {import('discord.js').Message} oldMessage
 * @param {import('discord.js').Message} newMessage
 */
async function processCommandsEditMessage(client, oldMessage, newMessage) {
    if (newMessage.partial) newMessage = await newMessage.fetch();
    await processCommandsNewMessage(client, newMessage);
}

export { loadCommands, processCommandsNewMessage, processCommandsEditMessage };
