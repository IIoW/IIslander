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

    if (command === 'debug') startEval(true, { userDb, responseDb });
    else if (command === 'db') startEval(false, { userDb, responseDb, UserDto, ResponseDto });
    else if (command === 'backup') {
        const dbs = args[0]
            ? args.filter((a) => databases.find((d) => d.name === a))
            : databases.map((db) => db.name);
        if (!dbs[0])
            logAndDie(
                `Please provide valid databases. The valid choices are "${databases
                    .map((db) => db.name)
                    .join('", "')}" or nothing for all of them.`
            );
        await fs.mkdir('./backups').catch(() => {});
        await Promise.all(
            dbs.map(async (db) => {
                try {
                    await fs.writeFile(
                        `./backups/${db}.json`,
                        await databases.find((d) => d.name === db).db.export()
                    );
                    console.log(`Successfully saved: ${db}`);
                } catch (e) {
                    console.error(`Error saving: ${db}`);
                    console.error(e);
                }
            })
        );
        console.log('Finished!');
    } else if (command === 'restore') {
        const dbs = args[0]
            ? args.filter((a) => databases.find((d) => d.name === a))
            : databases.map((db) => db.name);
        if (!dbs[0])
            logAndDie(
                `Please provide valid databases. The valid choices are "${databases
                    .map((db) => db.name)
                    .join('", ')}" or nothing for all of them.`
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
                    databases
                        .find((d) => d.name === db)
                        .db.import(await fs.readFile(`./backups/${db}.json`));
                    console.log(`Successfully loaded: ${db}`);
                } catch (e) {
                    console.error(`Error loading: ${db}`);
                    console.error(e);
                }
            })
        );
        console.log('Finished!');
    } else if (command === 'help') console.log(helpMessage);
    else logAndDie(`Unknown command "${command}"!`);
})();
