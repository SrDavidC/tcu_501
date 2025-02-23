var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Play & Learn'});
});

router.get('/slide-puzzle', function(req, res, next) {
  res.render('slide_puzzle', { title: 'Slide Puzzle'});
});

router.get('/wordle', function(req, res, next) {
  res.render('wordle', { title: 'Wordle'});
});

router.get("/credits", function (req, res) {
  res.render('credits', {title: 'Credits'})
});


module.exports = router;
