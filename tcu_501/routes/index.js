var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Titulo' , content: "Holaa,prueba"});
});

module.exports = router;
