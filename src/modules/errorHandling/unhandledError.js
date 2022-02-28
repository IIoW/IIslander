import { factionDb, keyDb, responseDb, userDb } from '../../dbs';
import { getClient } from '../../util';

process.on('uncaughtException', (err) => {
    console.error('Uncaught Error!!!!\nSomebody better fix this!!!');
    console.error(err);
    getClient()?.destroy();
    Promise.all([userDb.close(), responseDb.close(), keyDb.close(), factionDb.close()]).then(
        process.exit(1)
    );
});
