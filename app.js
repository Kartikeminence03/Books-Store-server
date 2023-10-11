const express = require('express');
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const cors = require("cors");
const ErrorHandler = require('./utils/ErrorHandler');
const app = express();


app.use(express.json())
app.use(cookieParser())
app.use(bodyParser.json());
app.use(cors());

app.use("/", (req, res) => {
  res.send("Hello world!");
});

// config
if (process.env.NODE_ENV !== "PRODUCTION") {
    require("dotenv").config({
      path: "./config/.env",
    });
};

// import router
const user = require('./controller/user');

app.use('/api/v1/user', user)

// it's for ErrorHandler
app.use(ErrorHandler)
module.exports = app;
