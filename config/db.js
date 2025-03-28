const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();

mongoose.set("strictQuery", true);

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("Server is connected to db");
  })
  .catch((err) => {
    console.log(err);
    console.log("Issue while connected to db");
  });

mongoose.connection.on("connect", () => {
  console.log("mongoose default connection open to" + process.env.MONGO_URI);
});

mongoose.connection.on("error", (err) => {
  console.log("Error while connecting to db", err);
});

mongoose.connection.on("disconnect", () => {
  console.log("Disconnected from db");
});

process.on("SIGINT", () => {
  process.exit(0);
});

module.exports = mongoose.connection;
