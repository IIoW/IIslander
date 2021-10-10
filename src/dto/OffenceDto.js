/** Class representing offence data. */
export default class OffenceDto {
    /**
     * Create new offence data.
     * @param {String[]} trigger - The regex to trigger.
     * @param {boolean} isRegex - If the trigger is a regular expression
     * @param {String} offence - What to respond with or the image location.
     */
    /**
     * Represents an offence a user had.
     * @param {string} type - The type of mod action (E.G. penalize, warn, etc.)
     * @param {string} offence - The type of offence. Should be one of the ones in the offenceDescriptions constants.
     * @param {string} modReason - The reason the mod did the action.
     * @param {number} [xpDeduction] - How much xp was deduced. Null if not applicable.
     * @param {number} time - The timestamp this happened.
     * @param {number} [endTime] - When the action ends. Null if not applicable.
     */
    constructor(type, offence, modReason, xpDeduction, time = Date.now(), endTime) {
        this.type = type;
        this.offence = offence;
        this.modReason = modReason;
        this.xpDeduction = xpDeduction;
        this.time = time;
        this.endTime = endTime;
    }

    get isRecent() {
        // If the offence happened in the last 24 hours
        return Date.now() - this.time < 8.64e7;
    }

    /**
     * Serializes the offence object.
     * @returns {object} A JSON representation of the offence.
     */
    toJSON() {
        return {
            type: this.type,
            offence: this.offence,
            modReason: this.modReason,
            xpDeduction: this.xpDeduction,
            time: this.time,
            endTime: this.endTime,
        };
    }

    /**
     * Deserialize JSON data.
     * @param {object} object - The object to deserialize.
     * @returns {OffenceDto} The offence object from the JSON.
     */
    static fromJSON(object) {
        return new OffenceDto(
            object.type,
            object.offence,
            object.modReason,
            object.xpDeduction,
            object.time,
            object.endTime
        );
    }
}
