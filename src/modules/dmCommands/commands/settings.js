import { ButtonBuilder, ButtonStyle } from 'discord.js';
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
    let subscribe = userDto.notifications.get('cooldownEnd');
    const cooldownPage = new EmbedPage(
        'cooldown',
        'Get notified if you are able to use your awards again',
        [
            new ButtonBuilder()
                .setLabel(subscribe ? 'unsubscribe' : 'subscribe')
                .setStyle(subscribe ? ButtonStyle.Danger : ButtonStyle.Success)
                .setCustomId('settings.cooldownEnd'),
        ]
    );
    pages.push(cooldownPage);

    subscribe = userDto.notifications.get('twitter');
    const twitterPage = new EmbedPage('twitter', 'Get notified when Jwiggs tweets', [
        new ButtonBuilder()
            .setLabel(subscribe ? 'unsubscribe' : 'subscribe')
            .setStyle(subscribe ? ButtonStyle.Danger : ButtonStyle.Success)
            .setCustomId('settings.tweets'),
    ]);
    pages.push(twitterPage);

    subscribe = userDto.notifications.get('levelPing');
    const levelPingPage = new EmbedPage(
        'Levelup Pings',
        'Get notified when you level up or get awarded',
        [
            new ButtonBuilder()
                .setLabel(subscribe ? 'unsubscribe' : 'subscribe')
                .setStyle(subscribe ? ButtonStyle.Danger : ButtonStyle.Success)
                .setCustomId('settings.levelPing'),
        ]
    );
    pages.push(levelPingPage);

    const member = await getMember(user.id);
    const osPage = new EmbedPage(
        'Operating System',
        'People use different Operating System. Choose the one you use below',
        [
            new ButtonBuilder({
                customId: `settings.os.windows`,
                style: member.roles.cache.has(getRole('windows'))
                    ? ButtonStyle.Danger
                    : ButtonStyle.Success,
                label: 'Windows (as useful as in space)',
            }),
            new ButtonBuilder({
                customId: `settings.os.linux`,
                style: member.roles.cache.has(getRole('linux'))
                    ? ButtonStyle.Danger
                    : ButtonStyle.Success,
                label: 'Linux (penguin gang)',
            }),
            new ButtonBuilder({
                customId: `settings.os.mac`,
                style: member.roles.cache.has(getRole('mac'))
                    ? ButtonStyle.Danger
                    : ButtonStyle.Success,
                label: 'Mac (with cheese please)',
            }),
        ]
    );
    pages.push(osPage);

    subscribe = member.roles.cache.has(getRole('subscriber'));
    const subscriberPage = new EmbedPage('Subscriber', 'Get Pinged, when Announcements are made', [
        new ButtonBuilder()
            .setLabel(subscribe ? 'unsubscribe' : 'subscribe')
            .setStyle(subscribe ? ButtonStyle.Danger : ButtonStyle.Success)
            .setCustomId('settings.subscriber'),
    ]);
    pages.push(subscriberPage);

    subscribe = member.roles.cache.has(getRole('tester'));
    const testerPage = new EmbedPage('Tester', 'Get access to test versions of the game', [
        new ButtonBuilder()
            .setLabel(subscribe ? 'unsubscribe' : 'subscribe')
            .setStyle(subscribe ? ButtonStyle.Danger : ButtonStyle.Success)
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
