import { addXp } from '../../../xpHandling';
import getXpOfMessage from '../utils';
import config from '../../../config';

export default async function messageCreate(client, message) {
    if (message.author.bot || message.guild?.id !== config.defaultGuild) return;
    await addXp(message.member, getXpOfMessage(message));
}
