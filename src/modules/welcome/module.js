import { welcomeMessage, welcomeMessages, welcomeQuestions } from '../../constants/Messages';
import { getChannel } from '../../util';

const subscriptions = new Map();

subscriptions.set('guildMemberAdd', async (client, member) => {
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
        `I have a question for you ${member.user.username}! ${
            welcomeQuestions[Math.floor(Math.random() * welcomeQuestions.length)]
        }`
    );
});

const enabled = true;

export { subscriptions, enabled };
