import { addXp } from '../general';
import getXpOfMessage from './const';

export default async function messageCreate(client, message) {
    if (message.author.bot) return;
    await addXp(message.member, getXpOfMessage(message));
}
