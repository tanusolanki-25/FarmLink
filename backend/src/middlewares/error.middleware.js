import { ApiError } from "../utils/apiError.js";

const errorHandler = (err, req, res, next) => {
  try {
    let error = err;
  
    if (!(error instanceof ApiError)) {
      const statusCode = error.statusCode || 500;
      const message = error.message || "Internal Server Error";
      error = new ApiError(statusCode, message, error?.errors || [], err.stack);
    }
  
    const response = {
      statusCode: error.statusCode,
      message: error.message,
      success: false,
      errors: error.errors,
      ...(process.env.NODE_ENV === "development" ? { stack: error.stack } : {}),
    };
  
    return res.status(error.statusCode).json(response);
  } catch (error) {
    console.error(error);
    console.error(error.message);
    console.error(error.stack);
  }
};

export { errorHandler };
