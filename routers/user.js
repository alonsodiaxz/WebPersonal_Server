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
  activateUser,
  deleteUser,
  signUpAdmin,
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
api.put("/activate-user/:id", [md_auth.ensureAuth], activateUser);
api.delete("/delete-user/:id", [md_auth.ensureAuth], deleteUser);
api.post("/sign-up-admin", [md_auth.ensureAuth], signUpAdmin);

module.exports = api;
