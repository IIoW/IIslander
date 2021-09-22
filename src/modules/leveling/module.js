import messageDelete from './messages/messageDelete';
import messageCreate from './messages/messageCreate';
import messageEdit from './messages/messageEdit';
import onMessageReactionAdd from './awards/reactions';

const subscriptions = new Map();
subscriptions.set('messageCreate', messageCreate);
subscriptions.set('messageDelete', messageDelete);
subscriptions.set('messageUpdate', messageEdit);

subscriptions.set('messageReactionAdd', onMessageReactionAdd);

const enabled = true;

export { subscriptions, enabled };
