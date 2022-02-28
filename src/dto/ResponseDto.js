/** Class representing auto response data. */
export default class ResponseDto {
    /**
     * Create new auto response data.
     * @param {String[]} trigger - The regex to trigger.
     * @param {String} response - What to respond with or the image location.
     * @param {String} title - What to put as the title of the response.
     */
    constructor(trigger = [''], response = '', title = '') {
        this.trigger = trigger;
        this.response = response;
        this.title = title;
    }

    /**
     * Serializes the auto response object.
     * @returns {object} A JSON representation of the auto response.
     */
    toJSON() {
        return {
            trigger: this.trigger,
            response: this.response,
            title: this.title,
        };
    }

    /**
     * Deserialize JSON data.
     * @param {object} object - The object to deserialize.
     * @returns {ResponseDto} The auto response object from the JSON.
     */
    static fromJSON(object) {
        return new ResponseDto(object.trigger, object.response, object.title);
    }
}
