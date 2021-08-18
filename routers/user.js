const express = require("express");
const UserController = require("../controllers/users");
const multipart = require("connect-multiparty");
const md_auth = require("../middlewares/authenticated");
const md_upload_avatar = multipart({
  uploadDir: "./uploads/avatar",
});

const api = express.Router();

const {
  signUp,
  signIn,
  getUsers,
  getUsersActive,
  updateUser,
  uploadAvatar,
  getAvatar,
} = UserController;

api.post("/sign-up", signUp);
api.post("/sign-in", signIn);
api.get("/users", [md_auth.ensureAuth], getUsers);
api.get("/users-active", [md_auth.ensureAuth], getUsersActive);
api.put("/update-user/:id", [md_auth.ensureAuth], updateUser);
api.put(
  "/upload-avatar/:id",
  [md_auth.ensureAuth, md_upload_avatar],
  uploadAvatar
);
api.get("/get-avatar/:avatarName", getAvatar);

module.exports = api;
