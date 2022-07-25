import { ActionRowBuilder, ButtonBuilder, ButtonStyle } from 'discord.js';

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
        this.message = await message.reply(this.updateMessage());
        cache.set(this.message.id, this);
        setTimeout(() => {
            cache.delete(this.message.id);
        }, 360000);
    }

    updateMessage() {
        const page = this.pages[this.index];
        return {
            embeds: [page.toEmbed()],
            components: [
                new ActionRowBuilder().addComponents(page.buttons),
                new ActionRowBuilder().addComponents([
                    new ButtonBuilder()
                        .setLabel('«')
                        .setStyle(ButtonStyle.Primary)
                        .setCustomId(`settings.left`),
                    new ButtonBuilder()
                        .setLabel('»')
                        .setStyle(ButtonStyle.Primary)
                        .setCustomId(`settings.right`),
                ]),
            ],
        };
    }

    /**
     *
     * @param {String} id
     * @returns {EmbedPageMessage}
     */
    static getInstance(id) {
        return cache.has(id) ? cache.get(id) : null;
    }
}
