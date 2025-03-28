const express = require("express");

const app = express();
const dotenv = require("dotenv");
dotenv.config();
// middleware config
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// const fileupload=require('file-uploader)
// cookie parser config
const cookiParser = require("cookie-parser");
app.use(cookiParser());

// cors config
const cors = require("cors");
app.use(cors());

// db config
require("./config/db");
// routes config

const learningRoute = require("./routes/index");
app.use("/v1", learningRoute);

// cloudinary
const { cloudinaryConnect } = require("./config/cloudinary");
cloudinaryConnect();

// PORT
const PORT = process.env.PORT || 3000;
// server start
app.listen(PORT, () => {
  console.log(`Server is listening to the Port ${PORT}`);
});
