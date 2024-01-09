var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Choose your game'});
});

router.get('/slide-puzzle', function(req, res, next) {
  res.render('slide_puzzle', { title: 'Slide Puzzle'});
});


module.exports = router;
