//Global error handler

module.exports = (err, req, res, next) => {
  // console.error("SIGNUP ERROR:", err);
  res.status(err.statusCode || 500).json({
    status: err.status || "error",
    message: err.message || err,
  });
};
