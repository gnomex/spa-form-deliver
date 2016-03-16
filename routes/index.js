var express = require('express');
var router = express.Router();
var nodemailer = require('nodemailer');
var cors = require('cors');
var CORSORIGIN = process.env.CORS || '*';

var corsOptions = {
  origin: CORSORIGIN,
  methods: 'POST'
};

// create reusable transporter object using the default SMTP transport
var smtp = process.env.SMTPCREDENTIALS || '';
var transporter = nodemailer.createTransport(smtp);

var SECRET = process.env.SPASECRET || '';
var SENDTO = process.env.EMAILS || '';

function validate_data(req, res, next) {
  var data = req.body;
  if (data.key && data.timestamp && data['form[content]'] && data['form[name]'] && data['form[email]'] ) {
    res.sendStatus(404);
  } else {
    next();
  }
}

function deliver_email(req, res, next) {
  var data = req.body;
  var sended_at = new Date(parseFloat(data.timestamp));
  var received_at = new Date(Date.now());

  var message = [data['form[content]'],
                  "\n\nEnviado em ",
                  sended_at.toString(),
                  ". Processado em ",
                  received_at.toString()
                ].join(' ');

  var mailOptions = {
    to: SENDTO,
    from: [data['form[name]'],"<",data['form[email]'],">"].join(' '),
    subject: data['form[subject]'],
    text: message
  };

  transporter.sendMail(mailOptions, function(error, info){
    if(error) { res.sendStatus(403); }

    res.sendStatus(201);
  });
}

router.post('/deliverforme', cors(corsOptions), validate_data, function(req, res, next) {

  if (req.body.key !== SECRET) {
    res.sendStatus(400);
  } else  {
    next();
  }

}, deliver_email);

module.exports = router;
