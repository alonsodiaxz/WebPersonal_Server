const express = require("express");
const UserController = require("../controllers/users");
const md_auth = require("../middlewares/authenticated");

const api = express.Router();

const { signUp, signIn, getUsers } = UserController;

api.post("/sign-up", signUp);
api.post("/sign-in", signIn);
api.get("/users", [md_auth.ensureAuth], getUsers);

module.exports = api;
