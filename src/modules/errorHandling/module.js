function error(client, exception) {
    console.log('an error occurred:');
    console.error(exception.stack);
}
/**
 * The events this module is subscribed to (entry points of this module, called when the specified event is triggered)
 */
const subscriptions = new Map();
subscriptions.set('error', error);

/**
 * if this module should be loaded on startup
 */
const enabled = true;

/**
 * Opens up the subscription to be accessible from the outside.
 */
export { subscriptions, enabled };
