function ready(client) {
    console.log('Getting ready...');
    console.log(`Logged in as ${client.user.tag} - id: ${client.user.id}`);
}

const subscriptions = new Map();
subscriptions.set('ready', ready);

const enabled = true;

export { subscriptions, enabled };
