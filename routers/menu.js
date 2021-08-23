const express = require("express");
const MenuController = require("../controllers/menu");
const md_auth = require("../middlewares/authenticated");

const api = express.Router();

const { addMenu } = MenuController;

api.post("/add-menu", [md_auth.ensureAuth], addMenu);

module.exports = api;
