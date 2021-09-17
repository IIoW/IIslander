// Removing import temporary for now, until this is tested and works
// import * as events from './modules/events';
import fs from 'fs';

const subscriptions = {
    'ready': [],
    'messageCreate': [],
    'messageDelete': [],
    'messageReactionAdd': [],
    'messageReactionRemove': [],
    'guildMemeberAdd': []
};

export default (client) => {

    /**
     * loads all modules and their subscriptions
     */
    fs.readdir('./src/modules').forEach((moduleName) => {
        // Loads the module
        const module = import(`./src/modules/${moduleName}/module.js`);
        // skips the module, in case it is disabled.
        if (!module.enabled) continue;
        // Loads each of it's subscriptions into their according list.
        module.subscriptions.forEach((event, fun) => {
            subscriptions[event].add(fun);
        });
    });

    /**
     * Setting up all events.
     * Currently all events have to be added manually,
     * but if you know a way how to auto bind and pass the parameters, 
     * feel free to change it up, that it binds all events specified in subscriptions
     */

    client.on('ready', () => {
        subscriptions['ready'].forEach(fun => {
            fun(client);
        });
    });
    client.on('messageCreate', (message) => {
        subscriptions['messageCreate'].forEach(fun => {
            fun(client, message);
        });
    });
    client.on('messageDelete', (message) => {
        subscriptions['messageDelete'].forEach(fun => {
            fun(client, message);
        });
    });
    client.on('messageReactionAdd', (reaction, user) => {
        subscriptions['messageReactionAdd'].forEach(fun => {
            fun(client, reaction, user);
        });
    });
    client.on('messageReactionRemove', (reaction, user) => {
        subscriptions['messageReactionRemove'].forEach(fun => {
            fun(client, reaction, user);
        });
    });
    client.on('guildMemberAdd', (member) => {
        subscriptions['guildMemeberAdd'].forEach(fun => {
            fun(client, member);
        });
    });
}