const xpCharacters = /\w/g;

export default function getXpOfMessage(message) {
    return message.content.split(xpCharacters).length - 1;
}
