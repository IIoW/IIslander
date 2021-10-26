import config from '../../config';

const xpCharacters = /\w/g;

export default function getXpOfMessage(message) {
    let xp = message.content.match(xpCharacters)?.length || 0;
    let multiplier = 2;
    if (config.channelModes.noXp.includes(message.channel.id)) multiplier = 0;
    else if (config.channelModes.reducedXp.includes(message.channel.id)) multiplier = 0.8;
    xp *= multiplier;
    if (message.attachments.size) xp += 100;
    return Math.round(xp);
}
