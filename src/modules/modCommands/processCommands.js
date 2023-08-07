import fs from 'fs/promises';
import { Collection } from 'discord.js';
import config from '../../config';
import { getUserMod } from '../../permissions';

const commands = new Collection();

async function loadCommands() {
    console.log('Loading mod commands...');

    const commandModules = await fs.readdir('./src/modules/modCommands/commands');

    await Promise.all(
        commandModules.map(async (moduleName) => {
            if (moduleName.endsWith('.js')) {
                const module = await import(`./commands/${moduleName}`);
                commands.set(module.info.name, module);
            }
        })
    );
    console.log(`loaded commands:\n\t${Array.from(commands.keys()).join('\n\t')}`);
    console.log('Finished loading mod commands');
}

/**
 *
 * @param {import('discord.js').Client} client
 * @param {import('discord.js').Message} message
 */
async function processCommandsNewMessage(client, message) {
    // Avoid botception
    if (message.author.bot) return;
    // Mod commands don't run in dm's.
    if (!message.guild) return;

    // This block of code ensures the command is valid and gets it.
    if (!message.content.startsWith(config.prefix)) return;
    const args = message.content.trim().slice(config.prefix.length).split(/ +/g);
    const command = args.shift().toLowerCase();
    const cmd = commands.get(command);
    if (!cmd) return;

    // Ensure the member is cached
    if (!message.member) await message.guild.members.fetch(message.author);
    const level = getUserMod(message.member);
    // Only users with the right perms can run it.
    if (cmd.info.level > level) return;

    try {
        await cmd.fun(client, message, args, level);
    } catch (e) {
        console.error(`Error running command "${command}":\n${e?.stack || e}`);
        message.channel
            .send(`Something went wrong processing that command! Please try again later.`)
            .catch((err) => console.error('Error sending error!\n', err));
    }
}

export { loadCommands, processCommandsNewMessage, commands };
