import Factions from '../../constants/Factions';
import { editMessage, factionDb, getEmoji, makeTitle, userDb } from '../../util';

const enabled = true;

const subscriptions = new Map();

const updateActivity = () => {
    const now = Date.now();
    const users = userDb
        .filter((user) => user.recentReset > now && user.activityRecent > 100)
        .map((user, id) => [user, id])
        .sort((a, b) => b[0].activityRecent - a[0].activityRecent);
    const content =
        users
            .map(
                ([user, id], i) =>
                    `${makeTitle((i + 1).toString())} <@${id}> - ${user.activityRecent}`
            )
            .slice(0, 7)
            .join('\n\n') ||
        'The leaderboard has been recently reset and there has been no recent activity.';
    const title = makeTitle('Activity Leaderboard');
    const message = `${title}\n\n${content}\n\n-`;
    return editMessage('activity', message);
};

const updateLeaderboard = () => {
    const counts = userDb.reduce((acc, user) => {
        if (user.faction && user.faction in Factions) {
            if (!acc[user.faction]) {
                acc[user.faction] = 0;
            }
            acc[user.faction] += 1;
        }
        return acc;
    }, {});
    const content = Object.entries(counts)
        .map(([faction, count]) => `**${faction.toUpperCase()}**: ${count}`)
        .join('\n\n');
    const title = makeTitle('Faction Members');
    const message =
        `${title}\n\n${content}\n\n` +
        'It is highly encouraged **not** to join the faction with the most amount of members. This keeps it fun for everyone playing, including you!';
    return editMessage('leaderboard', message);
};

const updateAwards = () => {
    const res = [];
    for (const [id, faction] of Object.entries(Factions)) {
        const data = factionDb.get(id);
        const content = data.awards.join('\n') || '-----\n';
        const title = `${getEmoji(faction.emote)}${makeTitle(`${id} Awards`)}${getEmoji(
            faction.emote
        )}`;
        const message = `${title}\n\n${content}\n\n` + '_ _';
        res.push(editMessage(faction.awardMessage, message));
    }
    return Promise.all(res);
};

const updateLeaderboards = () =>
    Promise.all([updateActivity(), updateLeaderboard(), updateAwards()]);

subscriptions.set('ready', async () => {
    await updateLeaderboards();
    setInterval(async () => {
        try {
            await updateLeaderboards();
        } catch (e) {
            console.error('Error updating leaderboards:');
            console.error(e);
        }
    }, 3000 * 60);
});

export { enabled, subscriptions };
