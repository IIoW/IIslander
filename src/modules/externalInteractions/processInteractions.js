import { InteractionResponseType, InteractionType } from 'discord-interactions';

/**
 *
 * @param {import('discord.js').Client} client
 * @param {import('discord-api-types').APIApplicationCommandInteraction} interactionData
 * @param {import('koa').Context} ctx
 */
const processSlashCommands = async (client, interactionData, ctx) => {
    ctx.body = {
        type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
        data: {
            content: `I am ${client.user} but this interaction is for <@${interactionData.application_id}>`,
        },
    };
    if (interactionData.data.type === 1) {
        // Slash Command
        // TODO: Add slash commands
    }
};

/**
 *
 * @param {import('discord.js').Client} client
 * @param {import('discord-api-types').APIApplicationCommandInteraction} interactionData
 * @param {import('koa').Context} ctx
 */
const processCommands = async (client, interactionData, ctx) => {
    if (interactionData.data.type === 1) {
        // Slash Command
        processSlashCommands(client, interactionData, ctx);
    }
};

/**
 *
 * @param {import('discord.js').Client} client
 * @param {import('discord-api-types').APIBaseInteraction} interactionData
 * @param {import('koa').Context} ctx
 */
async function processInteractions(client, interactionData, ctx) {
    if (interactionData.type === InteractionType.APPLICATION_COMMAND) {
        await processCommands(client, interactionData, ctx);
    }
    return null;
}

export default processInteractions;
