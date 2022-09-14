import config from '../../config';
import { welcomeMessage, welcomeMessages, welcomeQuestions } from '../../constants/Messages';
import ensureRoles from '../../roles';
import { getChannel, sanitizeUserInput } from '../../util';

const subscriptions = new Map();

subscriptions.set('guildMemberUpdate', async (client, oldMember, member) => {
    // checks if the pending status (which is true while screening is still in progress) has changed.
    // as it can only be set to false/null afterwards, this should work fine.
    if (oldMember.pending === member.pending) return;
    if (member.guild.id !== config.defaultGuild) return;
    await member.send(welcomeMessage).catch((e) => console.error('Error sending dm', e));

    const welcomeChannel = getChannel('welcome');
    const offtopicChannel = getChannel('just-chatting');

    await welcomeChannel.send(
        `${welcomeMessages[Math.floor(Math.random() * welcomeMessages.length)].replaceAll(
            '[name]',
            member.user
        )} Check out ${offtopicChannel} for a fun little question to answer!`
    );

    await offtopicChannel.send(
        `I have a question for you ${sanitizeUserInput(member.user.username)}! ${
            welcomeQuestions[Math.floor(Math.random() * welcomeQuestions.length)]
        }`
    );

    // Ensure the user has the right roles.
    await ensureRoles(member);
});

const enabled = true;

export { subscriptions, enabled };
