/** Class representing key data. */
export default class KeyDto {
    /**
     * Create new key data.
     * @param {String} value - The key's value.
     */
    constructor(value = '') {
        this.value = value;
    }

    /**
     * Serializes the key object.
     * @returns {object} A JSON representation of the key.
     */
    toJSON() {
        return {
            value: this.value,
        };
    }

    /**
     * Deserialize JSON data.
     * @param {object} object - The object to deserialize.
     * @returns {KeyDto} The key object from the JSON.
     */
    static fromJSON(object) {
        return new KeyDto(object.value);
    }
}
