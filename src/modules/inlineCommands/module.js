import {
    loadCommands,
    processCommandsEditMessage,
    processCommandsNewMessage,
} from './processCommands';

function messageCreate(client, message) {
    return processCommandsNewMessage(client, message);
}

function messageEdit(client, messageOld, messageNew) {
    return processCommandsEditMessage(client, messageOld, messageNew);
}

function ready() {
    return loadCommands();
}

const subscriptions = new Map();
subscriptions.set('messageCreate', messageCreate);
subscriptions.set('messageEdit', messageEdit);
subscriptions.set('ready', ready);

const enabled = true;

export { subscriptions, enabled };
