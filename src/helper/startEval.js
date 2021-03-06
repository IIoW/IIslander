import repl from 'repl';
// eslint-disable-next-line import/no-unresolved
import { setTimeout } from 'timers/promises';
import config from '../config';
import { getClient } from '../util';
import * as util from '../util';

const defaultContext = {
    config,
    util,
};
const startEval = async (startBot = false, context = {}) => {
    if (startBot) {
        await import('../index');
        context.client = getClient();
        context.client.on('ready', async () => {
            // Just so other stuff can log first.
            await setTimeout(100);
            console.log('The bot has been started and you now have eval permissions!');
            context.guild = context.client.guilds.cache.get(config.defaultGuild);
            return startEval(false, context);
        });
    } else {
        context = { ...defaultContext, ...context };
        console.log(
            `You have access to the following variables: ${Object.keys(context).join(', ')}`
        );
        const myRepl = repl.start({});

        Object.entries(context).forEach(([key, value]) => {
            myRepl.context[key] = value;
        });

        myRepl.on('exit', process.exit);
    }
};

export default startEval;
