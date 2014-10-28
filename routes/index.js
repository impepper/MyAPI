var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: 'Express' });
});

/* GET home page. */
router.get('/ocr', function(req, res) {
  res.render('index', { title: 'OCR' });
});

module.exports = router;
