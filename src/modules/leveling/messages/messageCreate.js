import { addXp } from '../general';
import getXpOfMessage from '../utils';
import config from '../../../config';

export default async function messageCreate(client, message) {
    if (message.author.bot) return;
    if (message.guild?.id !== config.defaultGuild) return;
    await addXp(message.member, getXpOfMessage(message));
}
