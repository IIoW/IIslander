import messageReactionAdd from './processReactions';

const subscriptions = new Map();
subscriptions.set('messageReactionAdd', messageReactionAdd);

const enabled = true;

export { subscriptions, enabled };
