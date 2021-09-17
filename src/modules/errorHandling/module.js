/**
 * Function called, when an error occurred while executing an event.
 * prints out the stacktrace.
 * @param client discord client
 * @param exception the exception which occured
 */
function error(client, exception) {
    console.error(`An error occurred:\n${exception.stack}`);
}
/**
 * subscribes to error events.
 */
const subscriptions = new Map();
subscriptions.set('error', error);

/**
 * do not disable. this handles all errors.
 */
const enabled = true;

export { subscriptions, enabled };
