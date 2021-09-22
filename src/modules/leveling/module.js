import messageDelete from './messages/messageDelete';
import messageCreate from './messages/messageCreate';
import messageEdit from './messages/messageEdit';

const subscriptions = new Map();
subscriptions.set('messageCreate', messageCreate);
subscriptions.set('messageDelete', messageDelete);
subscriptions.set('messageUpdate', messageEdit);

const enabled = true;

export { subscriptions, enabled };
