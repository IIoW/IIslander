import { removeXp } from '../../../xpHandling';
import getXpOfMessage from '../utils';
import config from '../../../config';

export default async function messageDelete(client, message) {
    if (message.partial || message.author.bot || message.guild?.id !== config.defaultGuild) return;
    if (!message.member) await message.guild.members.fetch(message.author);
    await removeXp(message.member, getXpOfMessage(message));
}
