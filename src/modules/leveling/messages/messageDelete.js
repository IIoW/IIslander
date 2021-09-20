import { removeXp } from '../general';
import getXpOfMessage from './const';

export default async function messageDelete(client, message) {
    if (message.author.bot) return;
    await removeXp(message.member, getXpOfMessage(message));
}
