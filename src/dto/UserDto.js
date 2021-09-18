/** Class representing user data. */
export default class UserDto {
    /**
     * Create new user data.
     * @param {number} xp
     * @param {Map<string, number>} cooldown
     * @param {string} faction
     * @param {string} key
     */
    constructor(xp = 0, cooldown = new Map(), faction = '', key = '') {
        this.xp = xp;
        this.cooldown = cooldown;
        this.faction = faction;
        this.key = key;
    }

    /**
     * Serializes the user object.
     * @returns A JSON representation of the user.
     */
    toJSON() {
        return {
            xp: this.xp,
            cooldown: Object.fromEntries(this.cooldown),
            faction: this.faction,
            key: this.key,
        };
    }

    /**
     * Deserialize JSON data.
     * @param {object} object - The object to deserialize.
     * @returns {UserDto} The user object from the JSON.
     */
    static fromJSON(object) {
        return new UserDto(object.xp, object.cooldown, object.faction, object.key);
    }
}
