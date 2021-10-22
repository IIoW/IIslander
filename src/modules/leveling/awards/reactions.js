import Emotes from '../../../constants/Emotes';
import { xpCooldown, xpReward, xpRewardDonor } from '../../../constants/Awards';
import { getChannel, getRole, userDb } from '../../../util';
import { addXp } from '../../../xpHandling';
import updateBoard from './starboard';

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

    const { message } = messageReaction;
    const userDto = userDb.get(user.id);
    const now = Date.now();

    if (userDto.cooldown.get(reactionName) > now || message.author === user) {
        await messageReaction.users.remove(user.id);
        return;
    }

    if (!messageReaction.me) {
        await message.react(messageReaction.emoji);
    }

    userDto.cooldown.set(reactionName, now + xpCooldown[reactionName]);

    userDb.set(user.id, userDto);

    const member = await message.guild.members.fetch(message.author);

    await member.roles.add(getRole(`cooldown_${reactionName}`));

    setTimeout(emit, xpCooldown[reactionName], client, reactionName, user.id);

    await addXp(member, xpReward[reactionName]);
    await addXp(user, xpRewardDonor[reactionName]);

    await getChannel('notifications').send(
        `${message.member.displayName} has been awarded a ${messageReaction.emoji} for <${message.url}>!`
    );

    await updateBoard(message);
}
