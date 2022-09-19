import './unhandledError';

/**
 * Function called, when an error occurred while executing an event.
 * prints out the stacktrace.
 * @param client discord client
 * @param exception the exception which occurred
 * @param additionalInfo
 */
function error(client, exception, additionalInfo) {
    if (!additionalInfo) console.error(`An error occurred:\n${exception.stack}`);
    else
        console.error(
            `A "${exception.name || 'Error'}" occurred in function ${
                additionalInfo.name
            } in event ${additionalInfo.event}:\n${exception.stack}`
        );
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
