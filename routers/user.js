const express = require("express");
const UserController = require("../controllers/users");
const md_auth = require("../middlewares/authenticated");

const api = express.Router();

const { signUp, signIn, getUsers, getUsersActive } = UserController;

api.post("/sign-up", signUp);
api.post("/sign-in", signIn);
api.get("/users", [md_auth.ensureAuth], getUsers);
api.get("/users-active", [md_auth.ensureAuth], getUsersActive);

module.exports = api;
