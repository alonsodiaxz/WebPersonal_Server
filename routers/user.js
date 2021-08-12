const express = require("express");
const UserController = require("../controllers/users");

const api = express.Router();

const { signUp, signIn, getUsers } = UserController;

api.post("/sign-up", signUp);
api.post("/sign-in", signIn);
api.get("/users", getUsers);

module.exports = api;
