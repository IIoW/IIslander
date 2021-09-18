/** Class representing auto response data. */
export default class ResponseDto {
    // TODO: Add more types to the jsdocs. I don't know what types
    // exists and I haven't heard from commentator yet.
    /**
     * Create new auto response data.
     * @param {Regex} trigger - The regex to trigger.
     * @param {'text'} type - The type.
     * @param {String} response - What to respond with.
     */
    constructor(trigger = /.*/, type = 'text', response = '') {
        this.trigger = trigger;
        this.type = type;
        this.response = response;
    }

    /**
     * Serializes the auto response object.
     * @returns A JSON representation of the auto response.
     */
    toJSON() {
        return {
            trigger: this.trigger,
            type: this.type,
            response: this.response,
        };
    }

    /**
     * Deserialize JSON data.
     * @param {object} object - The object to deserialize.
     * @returns {ResponseDto} The auto response object from the JSON.
     */
    static fromJSON(object) {
        return new ResponseDto(new RegExp(object.trigger), object.type, object.response);
    }
}
