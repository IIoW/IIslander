
function ready(client) {
    // place your interenal functions here. 
    // I'd recomment putting them in a different file and just passing the call through, to not messy this file.
    console.log("Getting ready...");
    console.log("---------------------");
    console.log(`Logged in as ${client.user.tag} - id: ${client.user.id}`);
    console.log("---------------------");
}

function messageCreate(client, msg) {
    // place your interenal functions here. 
    // I'd recomment putting them in a different file and just passing the call through, to not messy this file.
    console.log(msg.content)
}

/**
 * The events this module is subscribed to (entry points of this module, called when the specified event is triggered)
 */
const subscriptions = {
    'ready': ready,
    'messageCreate': messageCreate
}

/**
 * if this module should be loaded on startup
 */
const enabled = true;

/**
 * Opens up the subscription to be accessible from the outside.
 */
export {
    subscriptions,
    enabled
};