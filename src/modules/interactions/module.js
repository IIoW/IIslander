import { loadButtons, processInteractions } from './processInteractions';

const subscriptions = new Map();
subscriptions.set('interactionCreate', processInteractions);
subscriptions.set('ready', loadButtons);

const enabled = true;

export { subscriptions, enabled };
