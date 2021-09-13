const express = require("express");
const NewsletterController = require("../controllers/newsletter");
const api = express.Router();

const { suscribeEmail } = NewsletterController;

api.post("/suscribe-newsletter/:email", suscribeEmail);

module.exports = api;
