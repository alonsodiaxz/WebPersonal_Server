const express = require("express");
const MenuController = require("../controllers/menu");
const md_auth = require("../middlewares/authenticated");

const api = express.Router();

const { addMenu, getMenus, updateMenu } = MenuController;

api.post("/add-menu", [md_auth.ensureAuth], addMenu);
api.get("/get-menus", [md_auth.ensureAuth], getMenus);
api.put("/update-menu/:id", [md_auth.ensureAuth], updateMenu);

module.exports = api;
