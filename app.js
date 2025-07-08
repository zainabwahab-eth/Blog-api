const express = require("express");
const blogRoute = require("./routes/blogRoute");
const userRoute = require("./routes/userRoute");
const globalErrorHandler = require("./controller/errController");

const app = express();
app.use(express.json());

app.use("/users", userRoute);
app.use("/blogs", blogRoute);

app.use(/.*/, (req, res) => {
  res.status(404).json({
    status: "fail",
    message: "Route not found",
  });
});
app.use(globalErrorHandler);

module.exports = app;
