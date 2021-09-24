import { pin } from '../../../permissions';
import Emotes from '../../../constants/Emotes';

const command = '<pin>';

async function fun(client, message) {
    if (!pin(message.member)) {
        message.react(Emotes.denied);
        return;
    }
    await message.pin();
    await message.react(Emotes.pin);
}

export { command, fun };
