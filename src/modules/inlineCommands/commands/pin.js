import { pin } from '../../../permissions';

const command = '<pin>';

async function fun(client, message) {
    if (!pin(message.member)) {
        message.react('🚫');
        return;
    }
    await message.pin();
    await message.react('📌');
}

export { command, fun };
