const bcrypt = require("bcrypt-nodejs");
const User = require("../models/user");
const {
  createAccessToken,
  refreshAccessToken,
  decodeToken,
} = require("../services/jwt");

function signUp(req, res) {
  const user = new User();
  const { name, lastname, email, password, repeatPassword } = req.body;
  user.name = name;
  user.lastname = lastname;
  user.email = email.toLowerCase();
  user.role = "Admin";
  user.active = false;

  if (!password || !repeatPassword) {
    res.status(404).send({ message: "Las contraseñas son obligatorias." });
  } else {
    if (password !== repeatPassword) {
      res.status(404).send({ message: "Las contraseñas no son iguales." });
    } else {
      bcrypt.hash(password, null, null, function (err, hash) {
        if (err) {
          res
            .status(500)
            .send({ message: "Error al encriptar la contraseña." });
        } else {
          user.password = hash;

          user.save((err, userStored) => {
            if (err) {
              res.status(500).send({ message: "El usuario ya existe." });
            } else {
              if (!userStored) {
                res.status(404).send({ message: "Error al crear el usuario." });
              } else {
                res.status(200).send({
                  message:
                    "Usuario almacenado correctamente en la base de datos.",
                  user: userStored,
                });
              }
            }
          });
        }
      });
    }
  }
}

function signIn(req, res) {
  const params = req.body;
  const email = params.email.toLowerCase();
  const password = params.password;

  //Buscar el usuario en la base de datos para ver que se ha registrado y darle un token
  User.findOne({ email }, (err, userStored) => {
    if (err) {
      res.status(500).send({ message: "Error del servidor." });
    } else {
      if (!userStored) {
        res.status(404).send({ message: "Usuario no encontrado." });
      } else {
        bcrypt.compare(password, userStored.password, (err, valid) => {
          if (err) {
            res.status(500).send({ message: "Error del servidor." });
          } else {
            if (valid) {
              if (!userStored.active) {
                res.status(200).send({
                  code: 200,
                  message: "El usuario no se ha activado.",
                });
              } else {
                const accessToken = createAccessToken(userStored);
                const refreshToken = refreshAccessToken(userStored);
                res.status(200).send({
                  code: 200,
                  message: "",
                  accessToken: `${accessToken}`,
                  refreshToken: `${refreshToken}`,
                });
              }
            } else {
              res
                .status(404)
                .send({ message: "La contraseña introducida es incorrecta." });
            }
          }
        });
      }
    }
  });
}

module.exports = {
  signUp,
  signIn,
};
