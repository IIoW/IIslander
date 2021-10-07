import { commands } from '../processCommands';

const info = {
    name: 'help',
    desc: 'Get help with commands!',
    level: 0,
};

/**
 *
 * @param {import('discord.js').Client} client
 * @param {import('discord.js').Message} message
 * @param {string[]} args
 */
// eslint-disable-next-line no-unused-vars
async function fun(client, message, args, level) {
    const cmds = commands.filter((c) => c.info.level <= level);
    // If they can only run the help command just ignore them.
    if (cmds.size <= 1) return;
    await message.reply(
        `**Moderator Commands**\n${cmds
            .map((c) => `**${c.info.name}**: ${c.info.desc}`)
            .join('\n')}`
    );
}

export { info, fun };
