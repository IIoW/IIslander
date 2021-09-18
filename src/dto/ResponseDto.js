export default class ResponseDto {
    constructor(trigger = /.*/, type = 'text', response = '') {
        this.trigger = trigger;
        this.type = type;
        this.response = response;
    }

    toJson() {
        return {
            trigger: this.trigger,
            type: this.type,
            response: this.response,
        };
    }

    static fromJson(object) {
        return new ResponseDto(new RegExp(object.trigger), object.type, object.response);
    }
}
