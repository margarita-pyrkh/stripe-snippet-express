const STRIPE_SETTINGS = require('./app.settings');
const keySecret = STRIPE_SETTINGS.SECRET_KEY;

const app = require('express')();
const stripe = require('stripe')(keySecret);
const bodyParser = require('body-parser');
const cors = require("cors");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE");
  res.header("Access-Control-Allow-Headers", "Content-Type");
  res.header("Content-Type", "application/json");
  next();
});

app.use(cors());

app.post('/charge', (req, res) => {
  const amount = req.body.amount;

  stripe.customers.create({
    email: req.body.token.email,
    source: req.body.token.id,
  })
    .then(customer =>
      stripe.charges.create({
        amount,
        description: 'Sample Charge',
        currency: 'usd',
        customer: customer.id
      }))
    .then(charge => res.status(200).json(charge))
    .catch(err => {
      console.log("Error:", err);
      res.status(500).send({ error: "Purchase Failed" });
    });
});


const port = 3020;

app.listen(port, () => console.log('Started server on 3020 port.'));

module.exports = app;