const jwt = require("jwt-simple");
const moment = require("moment");

const { SECRET_KEY } = require("../config");

function ensureAuth(req, res, next) {
  if (!req.headers.authorization) {
    return res
      .status(403)
      .send({ message: "La petición no tiene cabecera de autenticación." });
  }

  const token = req.headers.authorization.replace(/['"]+/g, "");

  try {
    var payload = jwt.decode(token, SECRET_KEY);
    if (payload.exp <= moment.unix()) {
      res.status(404).send({ message: "El token ha expirado." });
    }
  } catch (error) {
    //console.log(error);
    return res.status(404).send({ message: "Token no válido." });
  }

  req.user = payload;
  next();
}

module.exports = {
  ensureAuth,
};
