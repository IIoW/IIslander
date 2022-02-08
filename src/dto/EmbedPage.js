import { MessageEmbed } from 'discord.js';

export default class EmbedPage {
    /**
     *
     * @param {String} title
     * @param {String} description
     * @param {import('discord.js').MessageButton[]} buttons
     */
    constructor(title, description, buttons) {
        this.title = title;
        this.description = description;
        this.buttons = buttons;
    }

    toEmbed() {
        return new MessageEmbed().setTitle(this.title).setDescription(this.description);
    }
}
