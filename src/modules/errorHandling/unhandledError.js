import { getClient, userDb, responseDb, keyDb, factionDb } from '../../util';

process.on('uncaughtException', (err) => {
    console.error('Uncaught Error!!!!\nSomebody better fix this!!!');
    console.error(err);
    getClient()?.destroy();
    userDb.close();
    responseDb.close();
    keyDb.close();
    factionDb.close();
    process.exit(1);
});
