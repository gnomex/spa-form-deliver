var express = require('express');
var router = express.Router();
var my_module = require('../lib/my_module');
var lol = new my_module();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: lol.process(null, []) });
});

module.exports = router;
