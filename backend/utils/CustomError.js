class CustomError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;

    Error.captureStackTrace(this, this.constructor);

    this.status = `${statusCode}`.startsWith("4") ? "fail" : "error";
    this.message = message;
  }
}

module.exports = { CustomError };
