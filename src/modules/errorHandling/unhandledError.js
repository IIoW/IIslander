import { getClient } from '../../util';

process.on('uncaughtException', (err) => {
    console.error('Uncaught Error!!!!\nSomebody better fix this!!!');
    console.error(err);
    if (getClient()?.uptime < 1) {
        console.log("Client doesn't seem to be up. Killing bot!!!");
        process.exit(1);
    }
});
