const express = require("express");
const UserController = require("../controllers/users");

const api = express.Router();

const { signUp, signIn } = UserController;

api.post("/sign-up", signUp);
api.post("/sign-in", signIn);

module.exports = api;
