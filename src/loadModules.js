import fs from 'fs/promises';

const subscriptions = new Map();

export default async (client) => {
    /**
     * loads all modules and their subscriptions
     */
    const modules = await fs.readdir('./src/modules');

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
     * binds all events inside the subscriptions map to call all functions provided
     */
    subscriptions.forEach((funs, event) => {
        client.on(event, (...args) => {
            funs.forEach(async (fun) => {
                try {
                    await fun(client, ...args);
                } catch (e) {
                    client.emit('error', e);
                }
            });
        });
    });
};
