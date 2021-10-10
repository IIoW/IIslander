import { messageCreate, ready } from './message';

const subscriptions = new Map();
subscriptions.set('messageCreate', messageCreate)
subscriptions.set('ready', ready)

const enabled = true;

export { subscriptions, enabled }