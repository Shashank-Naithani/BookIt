const errorMiddleware = (error, req, res, next) => {
  console.error(`[Error] ${error.message}`);
  if (process.env.NODE_ENV !== "production") {
    console.error(error.stack);
  }

  const statusCode = error.statusCode || 500;

  return res.status(statusCode).json({
    success: false,
    statusCode,
    code: error.code || "INTERNAL_SERVER_ERROR",
    message: error.message || "Something went wrong",
    errors: error.errors || null,
  });
};

export default errorMiddleware;
