class ApiResponse {
    constructor(
        statusCode,
        data,
        code,
        message
    ) {
        this.success = true;
        this.statusCode = statusCode;
        this.code = code;
        this.message = message;
        this.data = data;
    }
}

export default ApiResponse;