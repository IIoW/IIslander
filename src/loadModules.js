// Removing import temporary for now, until this is tested and works
// import * as events from './modules/events';
import fs from 'fs';

const subscriptions = Map();

export default (client) => {

    /**
     * loads all modules and their subscriptions
     */
    fs.readdirSync('./src/modules').forEach((moduleName) => {
        // Loads the module
        const module = import(`./src/modules/${moduleName}/module.js`);
        // skips the module, in case it is disabled.
        if (!module.enabled) continue;
        // Loads each of it's subscriptions into their according list.
        module.subscriptions.forEach((event, fun) => {
            if (!subscriptions.has(event)) {
                subscriptions.set(event, []);
            }
            subscriptions.get(event).add(fun);
        });
    });

    /**
     * Setting up all events.
     */

    /**
     * Calles all provided functions with the given arguments.
     */
    function callEventFunctions(client, funs, ...args) {
        funs.forEach( fun => {
            fun(client, ...args)
        });
    }

    /**
     * binds all events inside the subscriptions map to call all functions provided
     */

    subscriptions.forEach( (event, funs) => {
        client.on(event, callEventFunctions.bind(null, client, funs))
    });
}