import { loadCommands, processCommandsNewMessage } from './processCommands';

function messageCreate(client, message) {
    return processCommandsNewMessage(client, message);
}

function ready() {
    return loadCommands();
}

const subscriptions = new Map();
subscriptions.set('messageCreate', messageCreate);
subscriptions.set('ready', ready);

const enabled = true;

export { subscriptions, enabled };
