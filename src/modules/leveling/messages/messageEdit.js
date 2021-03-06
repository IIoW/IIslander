import { addXp, removeXp } from '../../../xpHandling';
import getXpOfMessage from '../utils';
import config from '../../../config';

/**
 * @return {Promise<void>}
 */
export default async function messageEdit(client, messageOld, messageNew) {
    if (messageOld.partial || messageOld.author.bot || messageOld.guild?.id !== config.defaultGuild)
        return;
    if (messageNew.partial) messageNew = await messageNew.fetch();
    const oldXp = getXpOfMessage(messageOld);
    const newXp = getXpOfMessage(messageNew);

    const diff = newXp - oldXp;

    if (diff > 0) {
        await addXp(messageNew.member, diff);
    } else if (diff < 0) {
        await removeXp(messageNew.member, -diff);
    }
}
