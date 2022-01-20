import { messageCreate, messageUpdate } from './message';

const subscriptions = new Map();
subscriptions.set('messageCreate', messageCreate);
subscriptions.set('messageUpdate', messageUpdate);

const enabled = false;

export { subscriptions, enabled };
