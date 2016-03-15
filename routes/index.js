var express = require('express');
var router = express.Router();
var nodemailer = require('nodemailer');

// create reusable transporter object using the default SMTP transport
var transporter = nodemailer.createTransport('smtps://kenner.hp%40gmail.com:lamivbvfbqbsxtmp@smtp.gmail.com');

var SECRET = "c517fecf7fe21b87e8f5f986f485da1f5b2d90103695a8c46628e72e883af04fc5d84c279e3d24435bf2c9c610d5600ec96d37e06b4a1242e71a1f04e8e36d86";

router.post('/deliverforme', function(req, res, next) {
  if (req.body.key !== SECRET) { res.status(400).send("Impossível registrar"); }

  var data = req.body;

  var mailOptions = {
    to: 'kenner.hp@gmail.com, anb.bernardes@gmail.com',
    from: [data['form[name]'],"<",data['form[email]'],">"].join(' '),
    subject: data['form[subject]'],
    text: data['form[content]']
  };

  transporter.sendMail(mailOptions, function(error, info){
    if(error){
        return console.log(error);
    }
    console.log('Message sent: ' + info.response);
  });

  res.status(201).send();
});

module.exports = router;
