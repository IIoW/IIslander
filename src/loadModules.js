import * as events from './modules/events';

export default (client) => {
    client.on('ready', () => {
        events.ready(client);
    });
    client.on('messageCreate', (message) => {
        events.messageCreate(client, message);
    });
    client.on('messageDelete', (message) => {
        events.messageDelete(client, message);
    });
    client.on('messageReactionAdd', (reaction, user) => {
        events.messageReactionAdd(client, reaction, user);
    });
    client.on('messageReactionRemove', (reaction, user) => {
        events.messageReactionRemove(client, reaction, user);
    });
    client.on('guildMemberAdd', (member) => {
        events.guildMemberAdd(client, member);
    });
}