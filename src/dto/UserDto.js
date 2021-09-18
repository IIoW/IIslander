export default class UserDto {
    /**
     *
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

    toJson() {
        return {
            xp: this.xp,
            cooldown: Object.fromEntries(this.cooldown),
            faction: this.faction,
            key: this.key,
        };
    }

    static fromJson(object) {
        return new UserDto(object.xp, object.cooldown, object.faction, object.key);
    }
}
