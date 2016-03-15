var express = require('express');
var router = express.Router();
var nodemailer = require('nodemailer');

// create reusable transporter object using the default SMTP transport
var smtp = process.env.SMTPCREDENTIALS || '';
var transporter = nodemailer.createTransport(smtp);

var SECRET = process.env.SPASECRET || '';

router.post('/deliverforme', function(req, res, next) {
  var data = req.body;

  console.log("##\n\n", data, "\n\n##");

  if (data.key !== SECRET) { res.status(400).send(); }

  var sended_at = new Date(parseFloat(data.timestamp));
  var received_at = new Date(Date.now());

  var message = [data['form[content]'],
                  "\n\nEnviado em ",
                  sended_at.toString(),
                  ". Processado em ",
                  received_at.toString()
                ].join(' ');

  var mailOptions = {
    to: 'kenner.hp@gmail.com',
    from: [data['form[name]'],"<",data['form[email]'],">"].join(' '),
    subject: data['form[subject]'],
    text: message
  };

  transporter.sendMail(mailOptions, function(error, info){
    if(error) { res.status(403).send(); }
  });

  res.status(201).send();
});

module.exports = router;
