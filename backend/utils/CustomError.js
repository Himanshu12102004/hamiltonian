class CustomError extends Error {
  constructor(message, statusCode, description = "") {
    super(message);
    this.statusCode = statusCode;
    this.description = description;

    Error.captureStackTrace(this, this.constructor);

    this.status = `${statusCode}`.startsWith("4") ? "fail" : "error";
    this.message = message;
  }
}

module.exports = { CustomError };
