import * as exampleModule from './exampleModule/module';

function ready(client) {
    exampleModule.ready(client)
}
function messageCreate(client, msg) {
    exampleModule.messageCreate(client, msg)
}
function messageDelete(client, msg) {

}
function messageReactionAdd(client, reaction, user) {

}
function messageReactionRemove(client, reaction, user) {

}
function guildMemberAdd(client, member) {

}

export {
    ready,
    messageCreate,
    messageDelete,
    messageReactionAdd,
    messageReactionRemove,
    guildMemberAdd
}