const express = require("express");
const { refreshAccessToken } = require("../controllers/auth");

const api = express.Router();

api.post("/refresh-access-token", refreshAccessToken);

module.exports = api;
