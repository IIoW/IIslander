import { addXp, removeXp } from '../general';
import getXpOfMessage from '../utils';
import config from '../../../config';

/**
 * @return {Promise<void>}
 */
export default async function messageEdit(client, messageOld, messageNew) {
    if (messageOld.author.bot || messageOld.guild?.id !== config.defaultGuild) return;
    const oldXp = getXpOfMessage(messageOld);
    const newXp = getXpOfMessage(messageNew);

    const diff = newXp - oldXp;

    if (diff > 0) {
        await addXp(messageNew.member, diff);
    } else if (diff < 0) {
        await removeXp(messageNew.member, -diff);
    }
}
