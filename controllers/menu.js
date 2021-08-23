const Menu = require("../models/menu");

function addMenu(req, res) {
  const menu = new Menu();
  const { title, url, order, active } = req.body;
  menu.title = title;
  menu.url = url;
  menu.order = order;
  menu.active = active;

  menu.save((err, menuStored) => {
    if (err) {
      res.status(500).send({ message: "Error de servidor." });
    } else {
      if (!menuStored) {
        res.status(404).send({ message: "Error al crear el menú." });
      } else {
        res.status(200).send({ message: "Menú creado correctamente." });
      }
    }
  });
}

function getMenus(req, res) {
  Menu.find()
    .sort({ order: "asc" })
    .exec((err, menus) => {
      if (err) {
        res.status(500).send({ message: "Error de servidor." });
      } else {
        if (!menus) {
          res.status(404).send({ message: "Ningun menu almacenado." });
        } else {
          res.status(200).send({ menus });
        }
      }
    });
}

module.exports = {
  addMenu,
  getMenus,
};
