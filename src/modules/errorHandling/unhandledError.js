import { getClient } from '../../util';

process.on('uncaughtException', (err) => {
    console.error('Uncaught Error!!!!\nSomebody better fix this!!!');
    console.error(err);
    getClient()?.destroy();
    process.exit(1);
});
