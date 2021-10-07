import { messageCreate, messageReactionAdd } from './textResponses';

const subscriptions = new Map();
subscriptions.set('messageCreate', messageCreate);
subscriptions.set('messageReactionAdd', messageReactionAdd);

const enabled = true;

export { subscriptions, enabled };
