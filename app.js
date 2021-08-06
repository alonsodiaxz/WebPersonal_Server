const express = require("express");
const bodyParser = require("body-parser");

const app = express();
const { API_VERSION } = require("./config");

//Load Routings
const authRoutes = require("./routers/auth");
const userRoutes = require("./routers/user");

app.use(bodyParser.urlencoded({ extended: false })); //
app.use(bodyParser.json());

//Configure Header HTTP
//...

//Router Basic
//...

app.use(`/api/${API_VERSION}`, userRoutes);
app.use(`/api/${API_VERSION}`, authRoutes);

module.exports = app;
