const xpCharacters = /\w/g;

export default function getXpOfMessage(message) {
    return message.content.match(xpCharacters)?.length || 0;
}
