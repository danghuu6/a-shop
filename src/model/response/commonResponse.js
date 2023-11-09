
class CommonResponse {
    constructor(code, message, data) {
        this.code = code;
        this.message = message;
        this.data = !data ? null : data
    }

    send(res, header = {}) {
        return res.status(this.status).json(this);
    }
}

module.exports = CommonResponse;
