// An error that knows its HTTP status and error code. Throw it anywhere; the error handler
// turns it into { error: { code, message, details } }.
export default class ApiError extends Error {
  constructor(status, code, message, details = []) {
    super(message);
    this.status = status;
    this.code = code;
    this.details = details;
  }

  static notFound(message = 'Not found.') {
    return new ApiError(404, 'NOT_FOUND', message);
  }
}
