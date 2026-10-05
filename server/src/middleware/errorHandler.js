const errorHandler = (err, _req, res, _next) => {
  if (process.env.NODE_ENV !== "test") {
    console.error("SERVER ERROR:", err);
  }

  // Mongoose Bad ObjectId (CastError)
  if (err.name === "CastError") {
    return res.status(400).json({
      success: false,
      message: `Invalid ID format for ${err.path || "resource"}`,
    });
  }

  // Mongoose Validation Error
  if (err.name === "ValidationError") {
    const messages = Object.values(err.errors || {}).map((val) => val.message);
    return res.status(400).json({
      success: false,
      message: messages.join(", ") || "Validation failed",
    });
  }

  // MongoDB Duplicate Key Error
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue || {})[0] || "field";
    return res.status(409).json({
      success: false,
      message: `A record with this ${field} already exists`,
    });
  }

  // JWT Errors
  if (err.name === "JsonWebTokenError") {
    return res.status(401).json({
      success: false,
      message: "Invalid authentication token",
    });
  }

  if (err.name === "TokenExpiredError") {
    return res.status(401).json({
      success: false,
      message: "Authentication token expired",
    });
  }

  const statusCode = err.statusCode || (err.status && typeof err.status === "number" ? err.status : 500);

  return res.status(statusCode).json({
    success: false,
    message: err.isOperational || statusCode < 500
      ? err.message
      : "Internal server error",
  });
};

export default errorHandler;