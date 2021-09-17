import {
    loadCommands,
    processCommandsEditMessage,
    processCommandsNewMessage,
} from './processCommands';

function messageCreate(client, message) {
    processCommandsNewMessage(client, message);
}

function messageEdit(client, messageOld, messageNew) {
    processCommandsEditMessage(client, messageOld, messageNew);
}

function ready(client) {
    loadCommands();
}

const subscriptions = new Map();
subscriptions.set('messageCreate', messageCreate);
subscriptions.set('messageEdit', messageEdit);
subscriptions.set('ready', ready);

const enabled = true;

export { subscriptions, enabled };
