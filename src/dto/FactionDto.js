/** Class representing faction data.
 * Note that this does not contain constant faction data.
 * @see {@link Factions}
 */
export default class FactionDto {
    /**
     * Create new faction data.
     * @param {String[]} awards - The faction's awards.
     * @param {Object<string, number>} items - The faction's items.
     */
    constructor(awards = [], items = {}) {
        this.awards = awards;
        this.items = items;
    }

    /**
     * Serializes the faction object.
     * @returns {object} A JSON representation of the faction.
     */
    toJSON() {
        return {
            awards: this.awards,
            items: this.items,
        };
    }

    /**
     * Deserialize JSON data.
     * @param {object} object - The object to deserialize.
     * @returns {FactionDto} The faction object from the JSON.
     */
    static fromJSON(object) {
        return new FactionDto(object.awards, object.items);
    }
}
