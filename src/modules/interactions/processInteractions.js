import { Collection } from 'discord.js';
import fs from 'fs/promises';

const commands = new Collection();

async function loadButtons() {
    console.log('Loading buttons...');

    const buttonModules = await fs.readdir('./src/modules/interactions/buttons');

    await Promise.all(
        buttonModules.map(async (moduleName) => {
            if (moduleName.endsWith('.js')) {
                const module = await import(`./buttons/${moduleName}`);
                commands.set(module.command, module.fun);
            }
        })
    );
    console.log(
        `loaded buttons:\n\t${Array.from(commands.keys())
            .map((v) => v.toString().replace(/^\/?<(.+)>\/?$/, '$1'))
            .join('\n\t')}`
    );
    console.log('Finished loading buttons');
}

/**
 *
 * @param {import('discord.js').Client} client
 * @param {import('discord.js').MessageComponentInteraction} interaction
 */
async function processInteractions(client, interaction) {
    if (!interaction.isButton()) return null;
    const [name, ...args] = interaction.customId.split('.');
    const cmd = commands.get(name);
    if (!cmd) {
        console.error(`Unknown button type "${name}".`);
        return interaction.reply({ content: "I'm sorry something went wrong!", ephemeral: true });
    }
    try {
        await cmd(client, interaction, args);
    } catch (e) {
        console.error(`Error running button "${name}":\n${e?.stack || e}`);
        if (interaction.deferred || interaction.replied)
            interaction
                .followUp({
                    content: `Something went wrong processing that button! Please try again later.`,
                    ephemeral: true,
                })
                .catch((err) => console.error('Error sending error!\n', err));
        else
            interaction
                .reply({
                    content: `Something went wrong processing that button! Please try again later.`,
                    ephemeral: true,
                })
                .catch((err) => console.error('Error sending error!\n', err));
    }
    return null;
}

export { loadButtons, processInteractions };
