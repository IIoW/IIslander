import fs from 'fs';

const subscriptions = new Map();

export default async (client) => {
    /**
     * loads all modules and their subscriptions
     */
    const modules = fs.readdirSync('./src/modules');

    await Promise.all(
        modules.map(async (moduleName) => {
            // Loads the module
            const module = await import(`./modules/${moduleName}/module.js`);
            // skips the module, in case it is disabled.
            if (module.enabled) {
                // Loads each of it's subscriptions into their according list.
                module.subscriptions.forEach((fun, event) => {
                    if (!subscriptions.has(event)) {
                        subscriptions.set(event, []);
                    }
                    subscriptions.get(event).push(fun);
                });
            }
        })
    );

    /**
     * Setting up all events.
     */

    /**
     * Calles all provided functions with the given arguments.
     * @param {import('discord.js').Client} client
     * @param {Function[]} funs
     * @param {*[]} args
     */
    // eslint-disable-next-line no-shadow
    function callEventFunctions(client, funs, ...args) {
        funs.forEach((fun) => {
            fun(client, ...args);
        });
    }

    /**
     * binds all events inside the subscriptions map to call all functions provided
     */
    subscriptions.forEach((funs, event) => {
        client.on(event, callEventFunctions.bind(null, client, funs));
    });
};
