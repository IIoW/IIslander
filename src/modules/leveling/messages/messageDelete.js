import { removeXp } from '../general';
import getXpOfMessage from '../utils';
import config from '../../../config';

export default async function messageDelete(client, message) {
    if (message.author.bot) return;
    if (message.guild?.id !== config.defaultGuild) return;
    await removeXp(message.member, getXpOfMessage(message));
}
