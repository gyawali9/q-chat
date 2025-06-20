interface ApiErrorDetail {
  field?: string;
  message: string;
}

class ApiError extends Error {
  statusCode: number;
  data: null;
  success: false;
  errors: ApiErrorDetail[];

  constructor(
    statusCode: number,
    message = "Something went wrong",
    errors: ApiErrorDetail[] = [],
    stack = ""
  ) {
    super(message);
    this.name = "ApiError";
    this.statusCode = statusCode;
    this.data = null;
    this.success = false;
    this.errors = errors;

    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

export { ApiError, type ApiErrorDetail };
