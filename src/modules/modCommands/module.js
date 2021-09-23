import { loadCommands, processCommandsNewMessage } from './processCommands';

const subscriptions = new Map();
subscriptions.set('messageCreate', processCommandsNewMessage);
subscriptions.set('ready', loadCommands);

const enabled = true;

export { subscriptions, enabled };
