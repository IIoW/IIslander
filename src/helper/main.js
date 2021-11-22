import 'dotenv/config';
import fs from 'fs/promises';
import startEval from './startEval';
import { userDb, responseDb, keyDb, factionDb, getTomorrow } from '../util';
import UserDto from '../dto/UserDto';
import ResponseDto from '../dto/ResponseDto';
import { logAndDie, helpMessage, databases } from './helperUtil';
import KeyDto from '../dto/KeyDto';
import FactionDto from '../dto/FactionDto';

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
            startEval(true, { userDb, responseDb, keyDb, factionDb });
            break;
        }
        case 'db': {
            startEval(false, {
                userDb,
                responseDb,
                keyDb,
                factionDb,
                UserDto,
                ResponseDto,
                KeyDto,
                FactionDto,
            });
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
        case 'firebase': {
            try {
                console.log('Reading info...');
                const info = JSON.parse(await fs.readFile('./data/firebase.json'));
                const ownerOrKeyRegex = /^(?:\w+-\w+-\w+)|(?:owner)$/;
                const {
                    discordUserData: users,
                    discord: { autoresponse, cooldowns, keys, factions },
                } = info;
                console.log('Converting users...');
                const newUsers = Object.entries(users).map(
                    ([id, { xp, faction, xpRecent, ...data }]) => {
                        let key = null;
                        let giveaways = '';
                        if (data.key) {
                            if (data.key.match(ownerOrKeyRegex)) key = data.key;
                            else giveaways = data.key;
                        }
                        const user = new UserDto(
                            xp,
                            undefined,
                            faction,
                            0,
                            0,
                            key,
                            undefined,
                            undefined,
                            giveaways,
                            xpRecent,
                            getTomorrow()
                        );
                        return [id, user];
                    }
                );
                console.log('Converting cooldowns...');
                Object.entries(cooldowns).forEach(([id, cooldownStuff]) => {
                    Object.entries(cooldownStuff).forEach(([userId, cooldown]) => {
                        if (userId === 'holder') return;
                        const user = newUsers.find(([uid]) => userId === uid);
                        if (!user) console.warn(`Couldn't find user ${userId} in users!`);
                        else user[1].cooldown.set(id, cooldown);
                    });
                });
                console.log('Converting factions...');
                const factionMap = {
                    'Nova Alliance': 'nova',
                    'Prime Federation': 'prime',
                    'Strike Coalition': 'strike',
                };
                const newFactions = Object.entries(factions).map(
                    ([id, { achievements, inventory }]) => [
                        id,
                        new FactionDto(
                            Object.keys(achievements).filter((a) => a !== 'holder'),
                            inventory
                        ),
                    ]
                );
                console.log('Converting auto responses...');
                const newAutoResponces = Object.entries(autoresponse).map(
                    ([id, { triggers, response, title }]) => [
                        id,
                        new ResponseDto(
                            triggers.filter((t) => t),
                            response,
                            title
                        ),
                    ]
                );
                console.log('Converting keys...');
                const newKeys = Object.keys(keys).map((key) => new KeyDto(key));

                console.log('Storing user data...');
                for (const [id, user] of newUsers) {
                    if (id !== 'holder') userDb.set(id, user);
                }

                console.log('Storing faction data...');
                for (const [id, faction] of newFactions) {
                    const newId = factionMap[id];
                    if (!id) console.warn(`Couldn't find faction ${id} in faction map!`);
                    else factionDb.set(newId, faction);
                }

                console.log('Storing response data...');
                for (const [id, response] of newAutoResponces) {
                    if (id !== 'holder') responseDb.set(id, response);
                }

                console.log('Storing key data...');
                for (const key of newKeys) {
                    if (key.value !== 'holder') keyDb.set(key.value, key);
                }
            } catch (e) {
                console.error(
                    'Error getting data. Please ensure you have a valid json file in data/firebase.json.\nMore info:'
                );
                console.error(e);
            }
            break;
        }
        default: {
            logAndDie(`Unknown command "${command}"!`);
            break;
        }
    }
})();
