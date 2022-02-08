/**
 *
 * @param {import('discord.js').Client} client
 * @param {import('discord.js').MessageComponentInteraction} interaction
 */
async function processInteractions(client, interaction) {
    // Ignore interactions that are for the main bot
    if (interaction.applicationId === client.id) return null;
    await interaction.reply(`I am ${client.user} but this interaction is for <@${interaction.applicationId}>`);
}

export { processInteractions };
