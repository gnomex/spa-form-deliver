var express     = require('express');
var router      = express.Router();
var nodemailer  = require('nodemailer');
var cors        = require('cors');
// var CORSORIGIN = process.env.CORS || '*';
var CORSORIGIN  = '*';
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
  if (!data.key || !data.timestamp || !data['form[content]'] || !data['form[name]'] || !data['form[email]'] ) {
    console.log("Invalid post: ", data);
    res.sendStatus(404);
  }
  next();
}

function deliver_email(req, res, next) {
  var data = req.body;
  var sent_at = new Date(parseFloat(data.timestamp));
  var received_at = new Date(Date.now());

  var phone = data['form[phone]'] || 'não informado';

  var message = [data['form[name]'],
                  ', telefone: ',
                  phone,
                  ', tem uma dúvida:\n',
                  data['form[content]'],
                  "\n\nEnviado em ",
                  sent_at.toString(),
                  ". Processado em ",
                  received_at.toString()
                ].join(' ');

  var mailOptions = {
    to: SENDTO,
    from: [data['form[name]'],"<",data['form[email]'],">"].join(' '),
    subject: data['form[subject]'],
    text: message
  };

  console.log("Preparing mail, see: ", mailOptions);

  transporter.sendMail(mailOptions, function(error, info){
    if(error) {
      console.log("Error, email not sent");
      res.sendStatus(403);
    }
    // 200 for Ajax call, 201 for confirmation
    res.status(200).send({"status": 201,"message": "Created"});
  });
}

router.post('/deliverforme', cors(corsOptions), validate_data, function(req, res, next) {
    if (req.body.key !== SECRET) {
      console.log("Invalid token: ", req.body);
      res.sendStatus(400);
    }
    next();
  }, deliver_email);

module.exports = router;
