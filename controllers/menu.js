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

function updateMenu(req, res) {
  let menuData = req.body;
  const params = req.params;

  Menu.findByIdAndUpdate({ _id: params.id }, menuData, (err, menuUpdate) => {
    if (err) {
      res.status(500).send({ message: "Error del servidor." });
    } else {
      if (!menuUpdate) {
        res.status(404).send({ message: "No se ha encontrado el menu." });
      } else {
        res.status(200).send({ message: "Menú actualizado correctamente." });
      }
    }
  });
}

function activateMenu(req, res) {
  const { id } = req.params;
  const { active } = req.body;

  Menu.findByIdAndUpdate({ _id: id }, { active }, (err, menuStored) => {
    if (err) {
      res.status(500).send({ message: "Error del servidor" });
    } else {
      if (!menuStored) {
        res.status(404).send({ message: "Menu no encontrado." });
      } else {
        if (active) {
          res.status(200).send({ message: "Menu activado correctamente." });
        } else {
          res.status(200).send({ message: "Menu desactivado correctamente." });
        }
      }
    }
  });
}

module.exports = {
  addMenu,
  getMenus,
  updateMenu,
  activateMenu,
};
