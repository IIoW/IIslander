import { getUserLevel } from '../../permissions';

function ready(client) {
    // place your internal functions here.
    // I'd recommend putting them in a different file and just passing the call through, to not messy this file.
    console.log('Getting ready...');
    console.log('---------------------');
    console.log(`Logged in as ${client.user.tag} - id: ${client.user.id}`);
    console.log('---------------------');
}

function messageCreate(client, msg) {
    // place your internal functions here.
    // I'd recommend putting them in a different file and just passing the call through, to not messy this file.
    console.log(msg.content);
    console.log(getUserLevel(msg.member));
}

/**
 * The events this module is subscribed to (entry points of this module, called when the specified event is triggered)
 */
const subscriptions = new Map();
subscriptions.set('ready', ready);
subscriptions.set('messageCreate', messageCreate);

/**
 * if this module should be loaded on startup
 */
const enabled = true;

/**
 * Opens up the subscription to be accessible from the outside.
 */
export { subscriptions, enabled };
