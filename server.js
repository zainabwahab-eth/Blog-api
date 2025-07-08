const app = require("./app");
const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config({ path: "./config.env" });

const DB = process.env.DB_URL;

mongoose.connect(DB).then(() => {
  console.log("connection to mongodb successful");
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`You're listening to port ${PORT}`);
});
