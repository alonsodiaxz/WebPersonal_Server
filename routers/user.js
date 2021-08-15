const express = require("express");
const UserController = require("../controllers/users");
const multipart = require("connect-multiparty");
const md_auth = require("../middlewares/authenticated");
const md_upload_avatar = multipart({
  __dirname: "./uploads/avatar",
});

const api = express.Router();

const { signUp, signIn, getUsers, getUsersActive, updateUser, uploadAvatar } =
  UserController;

api.post("/sign-up", signUp);
api.post("/sign-in", signIn);
api.get("/users", [md_auth.ensureAuth], getUsers);
api.get("/users-active", [md_auth.ensureAuth], getUsersActive);
api.post("/update-user", [md_auth.ensureAuth], updateUser);
api.put(
  "/upload-avatar/:id",
  [md_auth.ensureAuth, md_upload_avatar],
  uploadAvatar
);

module.exports = api;
