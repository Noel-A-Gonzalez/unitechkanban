var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('inicio.html');
});

router.get('/tree', function(req, res, next) {
  res.render('tree.html');
});

module.exports = router;
