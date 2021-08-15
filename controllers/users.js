const bcrypt = require("bcrypt-nodejs");
const User = require("../models/user");
const fileSystem = require("fs");
const path = require("path");
const {
  createAccessToken,
  refreshAccessToken,
  decodeToken,
} = require("../services/jwt");

//Registrarse
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

//Logearse
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
                  message: "El usuario no esta activado.",
                });
              } else {
                const accessToken = createAccessToken(userStored);
                const refreshToken = refreshAccessToken(userStored);
                res.status(200).send({
                  code: 200,
                  message: "Usuario logeado con éxito.",
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

//Obtener lista de usuarios registrados
function getUsers(req, res) {
  User.find().then((users) => {
    if (!users) {
      res.status(404).send({ message: "No hay ningún usuario registrado." });
    } else {
      res.status(200).send({ message: "Usuarios encontrados", users });
    }
  });
}

//Obtener lista de usuarios activos registrados
function getUsersActive(req, res) {
  const query = req.query;

  //User.find({ active: true }).then((users) => {
  User.find({ active: query.active }).then((users) => {
    if (!users) {
      res.status(404).send({ message: "No hay ningún usuario registrado." });
    } else {
      res.status(200).send({ message: "Usuarios encontrados", users });
    }
  });
}

//Actualizar datos de un usuario.
function updateUser(req, res) {
  const user = new User();
  const { name, lastname, email, password, repeatPassword, role } = req.body;
  const id = req.user.id;
  user.name = name;
  user.lastname = lastname;
  user.email = email.toLowerCase();
  user.role = role;
  user.active = false;

  if ((password && !repeatPassword) || (!password && repeatPassword)) {
    res
      .status(404)
      .send({ message: "La contraseña debe estar en ambos campos." });
  } else {
    if (password) {
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
          }
        });
      }
    }
    const updateDoc = {
      $set: {
        name: user.name,
        lastname: user.lastname,
        email: user.email,
        role: user.role,
        active: user.active,
        password: user.password,
      },
    };
    User.updateOne({ _id: id }, updateDoc, (err, changes) => {
      if (err) {
        res.status(500).send({ message: "Error de servidor." });
      } else {
        if (!changes) {
          res.status(404).send({ message: "Error al actualizar el usuario." });
        } else {
          res.status(200).send({
            message: "Usuario actualizado correctamente en la base de datos.",
            changes,
          });
        }
      }
    });
  }
}

//Actualizar avatar del usuario.
function uploadAvatar(req, res) {
  const params = req.params;
  User.findById({ _id: params.id }, (err, userData) => {
    if (err) {
      res.status(500).send({ message: "Error del servidor." });
    } else {
      if (!userData) {
        res
          .status(404)
          .send({ message: "No se ha encontrado ningún usuario." });
      } else {
        let user = userData;
        if (req.files) {
          let filePath = req.files.avatar.path;
          let fileSplit = filePath.split("\\");
          let fileName = fileSplit[6];

          let extSplit = fileName.split(".");
          let fileExt = extSplit[1];
          console.log(fileExt);
          if (fileExt !== "png" && fileExt !== "jpg") {
            res.status(400).send({
              message:
                "La extensión de la imagen no es válida. (Extensiones permitidas .png y jpg)",
            });
          } else {
            user.avatar = fileName;
            User.findByIdAndUpdate(
              { _id: params.id },
              user,
              (err, userResult) => {
                if (err) {
                  res.status(500).send({
                    message: "Error del servidor.",
                  });
                } else {
                  if (!userResult) {
                    res.status(404).send({
                      message: "Usuario no actualizado.",
                    });
                  } else {
                    res.status(200).send({
                      message: "Usuario actualizado.",
                      avatarName: fileName,
                    });
                  }
                }
              }
            );
          }
        }
      }
    }
  });
}

module.exports = {
  signUp,
  signIn,
  getUsers,
  getUsersActive,
  updateUser,
  uploadAvatar,
};
