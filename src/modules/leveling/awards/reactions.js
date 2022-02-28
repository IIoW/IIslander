import Emotes from '../../../constants/Emotes';
import { xpCooldown, xpReward, xpRewardDonor } from '../../../constants/Awards';
import { addXp } from '../../../xpHandling';
import updateBoard from './starboard';
import { awards } from '../../../permissions';
import config from '../../../config';
import { userDb } from '../../../dbs';
import { getAndAddRole, getChannel, getMember, sanitizeUserInput } from '../../../util';

function emit(client, reactionName, userid) {
    client.emit('cooldownEnd', reactionName, userid);
}

/**
 * @param {import('discord.js').Client} client
 * @param {import('discord.js').MessageReaction} messageReaction
 * @param {import('discord.js').User} user
 */
export default async function messageReactionAdd(client, messageReaction, user) {
    if (messageReaction.partial) messageReaction = await messageReaction.fetch();

    const reactionName = messageReaction.emoji.name;
    if (user.bot || !Object.values(Emotes.awards).includes(reactionName)) return;
    if (messageReaction.emoji.guild?.id !== config.defaultGuild) return;

    const { message } = messageReaction;
    const userDto = userDb.get(user.id);
    const now = Date.now();
    const donor = await getMember(user.id);

    if (
        userDto.cooldown.get(reactionName) > now ||
        message.author.id === user.id ||
        !awards(donor).includes(reactionName) ||
        message.author.bot
    ) {
        await messageReaction.users.remove(user.id);
        return;
    }

    if (!messageReaction.users.cache.has(client.user.id)) {
        await message.react(messageReaction.emoji);
    }

    userDto.cooldown.set(reactionName, now + xpCooldown[reactionName]);

    userDb.set(user.id, userDto);

    if (!message.member) await message.guild.members.fetch(message.author);

    await getAndAddRole(`cooldown_${reactionName}`, donor);

    setTimeout(emit, xpCooldown[reactionName], client, reactionName, user.id);

    const awardee = message.member;
    const awardeeDto = userDb.get(awardee.id);

    await getChannel('notifications').send(
        `**${
            awardeeDto.notifications.get('levelPing')
                ? awardee
                : sanitizeUserInput(awardee.displayName)
        }** has been awarded a ${messageReaction.emoji} for <${message.url}>!`
    );

    await addXp(awardee, xpReward[reactionName]);
    await addXp(donor, xpRewardDonor[reactionName]);

    await updateBoard(message);
}
