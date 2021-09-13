const Newsletter = require("../models/newsletter");

function suscribeEmail(req, res) {
  const email = req.params.email;
  const newsletter = new Newsletter();

  if (!email) {
    res.status(404).send({ message: "Email no proporcionado." });
  } else {
    newsletter.email = email.toLowerCase();

    newsletter.save((err, newsletterStore) => {
      if (err) {
        res.status(500).send({ message: "El email ya existe.", code: 500 });
      } else {
        if (!newsletter) {
          res
            .status(404)
            .send({ message: "Error al registrar la newsletter.", code: 404 });
        } else {
          res.status(200).send({
            message: "Newsletter registrado correctamente.",
            code: 200,
          });
        }
      }
    });
  }
}

module.exports = { suscribeEmail };
