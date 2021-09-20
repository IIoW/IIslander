function messageCreate(client, message) {}

const subscriptions = new Map();
subscriptions.set('messageCreate', messageCreate);

const enabled = true;

export { subscriptions, enabled };
