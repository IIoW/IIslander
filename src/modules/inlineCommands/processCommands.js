import fs from 'fs';

const commands = new Map();

async function loadCommands() {
    console.log('Loading inline commands...');

    const commandModules = fs.readdirSync('./src/modules/inlineCommands/commands');

    await Promise.all(
        commandModules.map(async (moduleName) => {
            if (moduleName.endsWith('.js')) {
                const module = await import(`./commands/${moduleName}`);
                commands.set(module.command, module.fun);
            }
        })
    );

    console.log('Finished loading inline commands');
    console.log(commands);
}

/**
 *
 * @param {import('discord.js').Client} client
 * @param {import('discord.js').Message} message
 */
async function processCommandsNewMessage(client, message) {
    commands.forEach((fun, command) => {
        if (message.content.match(command) !== null) {
            fun(client, message);
        }
    });
}

/**
 *
 * @param {import('discord.js').Client} client
 * @param {import('discord.js').Message} oldMessage
 * @param {import('discord.js').Message} newMessage
 */
async function processCommandsEditMessage(client, oldMessage, newMessage) {
    await processCommandsNewMessage(client, newMessage);
}

export { loadCommands, processCommandsNewMessage, processCommandsEditMessage };
