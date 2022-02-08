import EmbedPageMessage from '../../../dto/EmbedPageMessage';
import { getMember, getRole, userDb } from '../../../util';

const command = 'settings';

/**
 *
 * @param {import('discord.js').GuildMember} member
 * @param {EmbedPage} page
 * @param {String} roleName
 * @returns {Promise<void>}
 */
async function handleToggle(member, page, roleName) {
    const m = await member.fetch(true);
    const role = await getRole(roleName);
    if (role === undefined) {
        const userDto = userDb.get(member.id);
        if (!userDto.notifications.get(roleName)) {
            userDto.notifications.set(roleName, true);
            page.buttons[0].setLabel('unsubscribe').setStyle('DANGER');
        } else {
            userDto.notifications.set(roleName, false);
            page.buttons[0].setLabel('subscribe').setStyle('SUCCESS');
        }
    } else if (m.roles.cache.has(role)) {
        await m.roles.remove(role);
        page.buttons[0].setLabel('subscribe').setStyle('SUCCESS');
    } else {
        await m.roles.add(role);
        page.buttons[0].setLabel('unsubscribe').setStyle('DANGER');
    }
}

/**
 *
 * @param {import('discord.js').GuildMember} member
 * @param {EmbedPage} page
 * @param {String} roleName
 * @returns {Promise<void>}
 */
async function handleOS(member, page, roleName) {
    const osToIndexMap = {
        windows: 0,
        linux: 1,
        mac: 2,
    };
    const buttonIndex = osToIndexMap[roleName];

    const role = await getRole(roleName);

    if (member.roles.cache.has(role)) {
        await member.roles.remove(role);
        page.buttons[buttonIndex].setStyle('SUCCESS');
    } else {
        await member.roles.add(role);
        page.buttons[buttonIndex].setStyle('DANGER');
    }
}

/**
 *
 * @param {import('discord.js').Client} client
 * @param {import('discord.js').ButtonInteraction} interaction
 * @param {string[]} args
 */
async function fun(client, interaction, args) {
    const page = EmbedPageMessage.getInstance(interaction.message.id);
    if (!page) {
        await interaction.update({
            content: 'This settings has expired. Please run `settings` again!',
            embeds: [],
            components: [],
        });
        return;
    }
    const currentPage = page.pages[page.index];
    if (args[0] === 'left') {
        page.index -= 1;
        if (page.index < 0) {
            page.index = page.pages.length - 1;
        }
    } else if (args[0] === 'right') {
        page.index = (page.index + 1) % page.pages.length;
    } else {
        switch (args[0]) {
            case 'os':
                await handleOS(await getMember(interaction.user.id), currentPage, args[1]);
                break;
            default:
                await handleToggle(await getMember(interaction.user.id), currentPage, args[0]);
        }
    }
    await page.update();
    await interaction.deferUpdate();
}

export { command, fun };
