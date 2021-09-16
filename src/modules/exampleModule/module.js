
function ready(client) {
    console.log("Getting ready...");
    console.log("---------------------");
    console.log(`Logged in as ${client.user.tag} - id: ${client.user.id}`);
    console.log("---------------------");
}

function messageCreate(client, msg) {
    console.log(msg.content)
}

export {
    ready,
    messageCreate
};