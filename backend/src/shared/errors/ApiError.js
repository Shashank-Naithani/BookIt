class ApiError extends Error {
  constructor(statusCode, code, message, errors = null) {
    super(message);

    this.success = false;
    this.statusCode = statusCode;
    this.code = code;
    this.errors = errors;
  }
}

export default ApiError;
