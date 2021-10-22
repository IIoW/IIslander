import 'dotenv/config';
import fs from 'fs/promises';
import startEval from './startEval';
import { userDb, responseDb } from '../util';
import UserDto from '../dto/UserDto';
import ResponseDto from '../dto/ResponseDto';
import { logAndDie, helpMessage, databases } from './helperUtil';

// Instantly executing async function to stop eslint from yelling at me.
(async () => {
    const args = process.argv.slice(2);

    const command = args.shift()?.toLowerCase();

    if (!command) logAndDie(helpMessage, 0);

    switch (command) {
        case 'help': {
            console.log(helpMessage);
            break;
        }
        case 'debug': {
            startEval(true, { userDb, responseDb });
            break;
        }
        case 'db': {
            startEval(false, { userDb, responseDb, UserDto, ResponseDto });
            break;
        }
        case 'backup': {
            const dbs = args[0] ? args.filter((a) => databases[a]) : Object.keys(databases);
            if (!dbs[0])
                logAndDie(
                    `Please provide valid databases. The valid choices are "${Object.keys(
                        databases
                    ).join('", "')}" or nothing for all of them.`
                );
            await fs.mkdir('./backups').catch(() => {});
            await Promise.all(
                dbs.map(async (db) => {
                    try {
                        await fs.writeFile(`./backups/${db}.json`, await databases[db].export());
                        console.log(`Successfully saved: ${db}`);
                    } catch (e) {
                        console.error(`Error saving: ${db}`);
                        console.error(e);
                    }
                })
            );
            console.log('Finished!');
            break;
        }
        case 'restore': {
            const dbs = args[0] ? args.filter((a) => databases[a]) : Object.keys(databases);
            if (!dbs[0])
                logAndDie(
                    `Please provide valid databases. The valid choices are "${Object.keys(
                        databases
                    ).join('", ')}" or nothing for all of them.`
                );
            try {
                await fs.readdir('./backups'); // ensure backups folder exists
            } catch (e) {
                logAndDie(
                    "Backups folder doesn't exist or something else went wrong. Please try again later."
                );
            }
            await Promise.all(
                dbs.map(async (db) => {
                    try {
                        databases[db].import(await fs.readFile(`./backups/${db}.json`));
                        console.log(`Successfully loaded: ${db}`);
                    } catch (e) {
                        console.error(`Error loading: ${db}`);
                        console.error(e);
                    }
                })
            );
            console.log('Finished!');
            break;
        }
        default: {
            logAndDie(`Unknown command "${command}"!`);
            break;
        }
    }
})();
