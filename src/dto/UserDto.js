import OffenceDto from './OffenceDto';

/** Class representing user data. */
export default class UserDto {
    /**
     * Create new user data.
     * @param {number} xp
     * @param {Map<string, number>} cooldown
     * @param {string} faction
     * @param {string} key
     * @param {OffenceDto[]} offences
     * @param {number} swearlevel
     * @param {number} everyoneping
     * @param {string|null} steamVia
     * @param {Map<string, boolean>} notifications
     * @param {OffenceDto} offences
     */
    constructor(
        xp = 0,
        cooldown = new Map(),
        faction = '',
        key = '',
        swearlevel = 0,
        everyoneping = 0,
        steamVia = null,
        notifications = new Map(),
        offences = []
    ) {
        // Data, which is getting saved across reboots
        this.xp = xp;
        this.cooldown = cooldown;
        this.faction = faction;
        this.key = key;
        this.swearlevel = swearlevel;
        this.everyoneping = everyoneping;
        this.steamVia = steamVia;
        this.notifications = notifications;
        this.offences = offences;

        // Data which is not necessary to be saved
        this.voiceTimeStampJoin = -1;
        this.voiceXpMultiplier = 0;
    }

    get level() {
        if (this.xp < 0) {
            return 0;
        }
        return Math.floor(((2.2 / 100) * this.xp) ** (1 / 2.2));
    }

    /**
     * Serializes the user object.
     * @returns A JSON representation of the user.
     */
    toJSON() {
        return {
            xp: this.xp,
            cooldown: this.cooldown,
            faction: this.faction,
            key: this.key,
            swearlevel: this.swearlevel,
            everyoneping: this.everyoneping,
            steamVia: this.steamVia,
            notifications: this.notifications,
            offences: this.offences.map((o) => o.toJSON()),
        };
    }

    /**
     * Deserialize JSON data.
     * @param {object} object - The object to deserialize.
     * @returns {UserDto} The user object from the JSON.
     */
    static fromJSON(object) {
        return new UserDto(
            object.xp,
            object.cooldown,
            object.faction,
            object.key,
            object.swearlevel,
            object.everyoneping,
            object.steamVia,
            object.notifications(object.offences || []).map((o) => OffenceDto.fromJSON(o))
        );
    }
}
