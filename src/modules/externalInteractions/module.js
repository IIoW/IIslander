import { InteractionResponseType, InteractionType, verifyKey } from 'discord-interactions';
import Koa from 'koa';
import koaBodyparser from 'koa-bodyparser';
import InteractionCreateAction from 'discord.js/src/client/actions/InteractionCreate';
import config from '../../config';
import { getClient } from '../../util';
import { processInteractions } from './processInteractions';

const subscriptions = new Map();
subscriptions.set('interactionCreate', processInteractions);

const enabled = true;

export { subscriptions, enabled };

const app = new Koa();
app.use(koaBodyparser());

app.use(async ctx => {

    const { body, rawBody } = ctx.request;

    // Your public key can be found on your application in the Developer Portal
    const pubKey = config.warlanderPublicKey;

    const signature = ctx.request.headers['x-signature-ed25519'];
    const timestamp = ctx.request.headers['x-signature-timestamp'];

    const isVerified = verifyKey(rawBody, signature, timestamp, pubKey);

    if (!isVerified) {
        ctx.status = 401;
        return;
    }

    if (body.type === InteractionType.PING) {
        ctx.body = {
            type: InteractionResponseType.PONG
        };
        return;
    }
    
    // Tell d.js to process this interaction.
    const test = new InteractionCreateAction(getClient());
    test.handle(body);
});
    
    app.listen(12004);                                                    