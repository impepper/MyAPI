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

/* GET home page. */
router.post('/ocr', function(req, res) {
	console.log('Got it');

	var formidable = require('formidable')
	var path = require('path')
	var dv = require('dv');
	var fs = require('fs');
	var form = new formidable.IncomingForm();
	form.parse(req, function(err, fields, files) {

		console.log(files.myfile.path+'/'+files.myfile.name);
        
        var langcode = fields.langcode
        console.log(langcode)

		//Assign File Type parameter 
		var imagetype='png'
		var imagefilename = new Date().getTime()
		var tempPath = files.myfile.path
		var targetPath = './tmpimages/'+imagefilename+'.png';
		switch(files.myfile.type) {
			case 'image/jpeg':
				imagetype='jpg'
				targetPath = './tmpimages/'+imagefilename+'.jpg'
				break;
			case 'image/gif':
				imagetype='gif'
				targetPath = './tmpimages/'+imagefilename+'.gif'
				break;
			default:
				imagetype='png'
				targetPath = './tmpimages/'+imagefilename+'.png'
		}

		//Save Uploaded file to temp folder 
		fs.rename(tempPath, path.resolve(targetPath), function(err) {
            if (err) throw err;
            console.log("Upload completed!");

            //Handle OCR Processing
    	  	var image = new dv.Image(imagetype, fs.readFileSync(targetPath));
			var tesseract = new dv.Tesseract(langcode, image);
			var tesstext = tesseract.findText('plain')
			console.log(tesstext);

			//Make Response Datas
			res.send({ocrtext:tesstext,ocrfile:targetPath,ocrlang:langcode})
		  	// res.render('ocrtext', { title: 'OCR', ocrtext:tesstext ,ocrfile:'./tmpimages/image.jpg'});

        });

		



    });

});

router.get('/upload', function(req, res) {
  	res.render('upload', { title: 'Upload' });
});

module.exports = router;
