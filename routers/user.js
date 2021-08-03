const express = require("express");
const UserController = require("../controllers/users");

const api = express.Router();

const { signUp } = UserController;

api.post("/sign-up", signUp);

module.exports = api;
