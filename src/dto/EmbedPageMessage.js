import { MessageActionRow, MessageButton } from 'discord.js';

/**
 *
 * @type {Map<String, EmbedPageMessage>}
 */
const cache = new Map();

export default class EmbedPageMessage {
    /**
     *
     * @param { EmbedPage[] } pages
     */
    constructor(pages) {
        if (pages.length === 0) {
            throw new Error('Page Message must contain at least one page');
        }
        this.pages = pages;
        this.index = 0;
        this.message = null;
    }

    /**
     *
     * @param {import('discord.js').Message} message
     */
    async send(message = null) {
        this.message = await message.reply('settings');
        cache[this.message.id] = this;
    }

    async update(message) {
        if (!this.message) {
            await this.send(message);
        }
        const page = this.pages[this.index];
        this.message.edit({
            embeds: [page.toEmbed()],
            components: [
                new MessageActionRow().addComponents(page.buttons),
                new MessageActionRow().addComponents([
                    new MessageButton()
                        .setLabel('«')
                        .setStyle('PRIMARY')
                        .setCustomId(`settings.left`),
                    new MessageButton()
                        .setLabel('»')
                        .setStyle('PRIMARY')
                        .setCustomId(`settings.right`),
                ]),
            ],
        });
    }

    /**
     *
     * @param {String} id
     * @returns {EmbedPageMessage}
     */
    static getInstance(id) {
        return cache[id];
    }
}
