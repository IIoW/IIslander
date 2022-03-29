import { MessageButton } from 'discord.js';
import EmbedPage from '../../../dto/EmbedPage';
import EmbedPageMessage from '../../../dto/EmbedPageMessage';
import { userDb } from '../../../dbs';
import { getMember, getRole } from '../../../util';

export const command = 'settings';
export const desc = 'Configure your user settings.';

/**
 *
 * @param { import('discord.js').User } user
 * @returns {Promise<EmbedPage[]>}
 */
async function getPages(user) {
    const userDto = userDb.get(user.id);
    const pages = [];
    let subscribe = userDto.notifications.get('cooldown');
    const cooldownPage = new EmbedPage(
        'cooldown',
        'Get notified if you are able to use your awards again',
        [
            new MessageButton()
                .setLabel(subscribe ? 'unsubscribe' : 'subscribe')
                .setStyle(subscribe ? 'DANGER' : 'SUCCESS')
                .setCustomId('settings.cooldown'),
        ]
    );
    pages.push(cooldownPage);

    subscribe = userDto.notifications.get('twitter');
    const twitterPage = new EmbedPage('twitter', 'Get notified when Jwiggs tweets', [
        new MessageButton()
            .setLabel(subscribe ? 'unsubscribe' : 'subscribe')
            .setStyle(subscribe ? 'DANGER' : 'SUCCESS')
            .setCustomId('settings.tweets'),
    ]);
    pages.push(twitterPage);

    subscribe = userDto.notifications.get('levelPing');
    const levelPingPage = new EmbedPage(
        'Levelup Pings',
        'Get notified when you level up or get awarded',
        [
            new MessageButton()
                .setLabel(subscribe ? 'unsubscribe' : 'subscribe')
                .setStyle(subscribe ? 'DANGER' : 'SUCCESS')
                .setCustomId('settings.levelPing'),
        ]
    );
    pages.push(levelPingPage);

    const member = await getMember(user.id);
    const osPage = new EmbedPage(
        'Operating System',
        'People use different Operating System. Choose the one you use below',
        [
            new MessageButton({
                customId: `settings.os.windows`,
                style: member.roles.cache.has(getRole('windows')) ? 'DANGER' : 'SUCCESS',
                label: 'Windows (as useful as in space)',
            }),
            new MessageButton({
                customId: `settings.os.linux`,
                style: member.roles.cache.has(getRole('linux')) ? 'DANGER' : 'SUCCESS',
                label: 'Linux (penguin gang)',
            }),
            new MessageButton({
                customId: `settings.os.mac`,
                style: member.roles.cache.has(getRole('mac')) ? 'DANGER' : 'SUCCESS',
                label: 'Mac (with cheese please)',
            }),
        ]
    );
    pages.push(osPage);

    subscribe = member.roles.cache.has(getRole('subscriber'));
    const subscriberPage = new EmbedPage('Subscriber', 'Get Pinged, when Announcements are made', [
        new MessageButton()
            .setLabel(subscribe ? 'unsubscribe' : 'subscribe')
            .setStyle(subscribe ? 'DANGER' : 'SUCCESS')
            .setCustomId('settings.subscriber'),
    ]);
    pages.push(subscriberPage);

    subscribe = member.roles.cache.has(getRole('tester'));
    const testerPage = new EmbedPage('Tester', 'Get access to test versions of the game', [
        new MessageButton()
            .setLabel(subscribe ? 'unsubscribe' : 'subscribe')
            .setStyle(subscribe ? 'DANGER' : 'SUCCESS')
            .setCustomId('settings.tester'),
    ]);
    pages.push(testerPage);

    return pages;
}

/**
 *
 * @param {import('discord.js').Client} client
 * @param {import('discord.js').Message} message
 * @return {Promise<void>}
 */
export async function fun(client, message) {
    const embedPages = await getPages(message.author);
    const embedPageMessage = new EmbedPageMessage(embedPages);
    await embedPageMessage.send(message);
}
