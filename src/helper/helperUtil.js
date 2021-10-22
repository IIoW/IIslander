import { userDb, responseDb } from '../util';

/**
 * Constant with database info.
 */
const databases = {
    user: userDb,
    response: responseDb,
};

/**
 * Constant for help.
 */
const helpMessage = `IIslander Helper
Usage: helper <command>

Commands:
\tdb\t\tCreate an eval session with the databases imported.
\tdebug\t\tCreate an eval session with the bot running.

\tbackup\t\tBackup the databases.
\trestore\t\tRestore the databases.

\thelp\t\tShows this message.`;

/**
 * Log a message and end the process.
 * @param {*} log - What to log.
 * @param {number} exit - The exit code.
 */
const logAndDie = (log, exit = 1) => {
    console.log(log);
    process.exit(exit);
};

export { databases, helpMessage, logAndDie };
