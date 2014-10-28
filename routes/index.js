var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: 'Express' });
});

/* GET home page. */
router.get('/ocr', function(req, res) {
	var dv = require('dv');
	var fs = require('fs');
	var image = new dv.Image('png', fs.readFileSync('textpage300.png'));
	var tesseract = new dv.Tesseract('eng', image);
	var tesstext = tesseract.findText('plain')
	// console.log(tesstext);
  	res.render('ocrtext', { title: 'OCR', ocrtext:tesstext });
});

module.exports = router;
