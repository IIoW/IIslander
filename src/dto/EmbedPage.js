import { EmbedBuilder } from 'discord.js';

export default class EmbedPage {
    /**
     *
     * @param {String} title
     * @param {String} description
     * @param {import('discord.js').ButtonBuilder[]} buttons
     */
    constructor(title, description, buttons) {
        this.title = title;
        this.description = description;
        this.buttons = buttons;
    }

    toEmbed() {
        return new EmbedBuilder().setTitle(this.title).setDescription(this.description);
    }
}
