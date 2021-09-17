const command = '<pin>';

async function fun(client, message) {
    console.warn('Currently ignoring user permissions.');
    // TODO: add user permission check
    await message.pin();
    await message.react('📌');
}

export { command, fun };
