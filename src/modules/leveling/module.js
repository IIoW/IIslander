import messageDelete from './messages/messageDelete';
import messageCreate from './messages/messageCreate';
import messageEdit from './messages/messageEdit';
import messageReactionAdd from './awards/reactions';
import voiceStateUpdate from './voice/voice';

const subscriptions = new Map();
subscriptions.set('messageCreate', messageCreate);
subscriptions.set('messageDelete', messageDelete);
subscriptions.set('messageUpdate', messageEdit);

subscriptions.set('messageReactionAdd', messageReactionAdd);

subscriptions.set('voiceStateUpdate', voiceStateUpdate);

const enabled = true;

export { subscriptions, enabled };
