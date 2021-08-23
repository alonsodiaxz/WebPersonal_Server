const bcrypt = require("bcrypt-nodejs");
const User = require("../models/user");
const fileSys = require("fs");
const path = require("path");
const {
  createAccessToken,
  refreshAccessToken,
  decodeToken,
} = require("../services/jwt");
const { exists } = require("../models/user");

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
          let fileName = fileSplit[2];
          let extSplit = fileName.split(".");
          let fileExt = extSplit[1];

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

//Te devuelve el archivo.
function getAvatar(req, res) {
  const avatarName = req.params.avatarName;
  const filePath = "./uploads/avatar/" + avatarName;

  fileSys.exists(filePath, (exists) => {
    if (!exists) {
      res.status(404).send({ message: "El avatar que buscas no existe." });
    } else {
      //Te devuelve el archivo gracias a la ruta absoluta.
      res.sendFile(path.resolve(filePath));
    }
  });
}

//Actualizar datos de un usuario.
async function updateUser(req, res) {
  const userData = req.body;
  userData.email = req.body.email.toLowerCase();
  const id = req.params.id;

  if (userData.password) {
    await bcrypt.hash(userData.password, null, null, function (err, hash) {
      if (err) {
        res.status(500).send({ message: "Error de encriptado." });
      } else {
        userData.password = hash;
      }
    });
  }

  User.updateOne({ _id: id }, userData, (err, changes) => {
    if (err) {
      res.status(500).send({ message: "Error de servidor." });
    } else {
      if (!changes) {
        res.status(404).send({ message: "Error al actualizar el usuario." });
      } else {
        res.status(200).send({
          message: "Usuario actualizado.",
          changes,
        });
      }
    }
  });
}

//Activar usuarios
function activateUser(req, res) {
  const { id } = req.params;
  const { active } = req.body;

  User.findByIdAndUpdate({ _id: id }, { active }, (err, userStored) => {
    if (err) {
      res.status(500).send({ message: "Error del servidor." });
    } else {
      if (!userStored) {
        res.status(404).send({ message: "Usuario no encotrado." });
      } else {
        if (active) {
          res.status(200).send({ message: "Usuario activado correctamente." });
        } else {
          res
            .status(200)
            .send({ message: "Usuario desactivado correctamente." });
        }
      }
    }
  });
}

//Eliminar usuarios
function deleteUser(req, res) {
  const { id } = req.params;
  User.findByIdAndDelete({ _id: id }, (err, userStored) => {
    if (err) {
      res.status(500).send({ message: "Error del servidor." });
    } else {
      if (!userStored) {
        res.status(404).send({ message: "Usuario no encontrado." });
      } else {
        res.status(200).send({ message: "Usuario eliminado." });
      }
    }
  });
}

//Añadir usuario desde el panel de adminsitrador
function signUpAdmin(req, res) {
  const user = User();
  const { name, lastname, password, repeatPassword, email, role } = req.body;
  user.name = name;
  user.lastname = lastname;
  user.email = email.toLowerCase();
  user.role = role;
  user.active = true;

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
                  message: "Usuario creado correctamente.",
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

module.exports = {
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
};
