const express = require("express");
const blogRoute = require("./routes/blogRoute");
const userRoute = require("./routes/userRoute");
const globalErrorHandler = require("./controller/errController");
const AppError = require("./utils/appError");

const app = express();
app.use(express.json());

app.use("/blogs", blogRoute);
app.use("/users", userRoute);

app.get("/", (req, res) => {
  res.redirect("/blogs");
});

app.all(/.*/, (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on the server!`, 404));
});

app.use(globalErrorHandler);

module.exports = app;
