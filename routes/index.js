var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: 'Express' });
});

/* GET home page. */
router.get('/ocrimage', function(req, res) {
	var fs = fs || require('fs'),
		files = fs.readdirSync('./tmpimages');
	var filelist = filelist || [];
	files.forEach(function(file) {
		if (file != '.DS_Store'){
			filelist.push('./tmpimages/'+file);
		}
	});

	// console.log(tesstext);
  	res.render('ocrimagelist',{title:'OCR-ed Images',filelist:filelist});
});

/* GET home page. */
router.get('/ocr', function(req, res) {
	var dv = require('dv');
	var fs = require('fs');
	var path = require('path');
	// var lwip = require('lwip')
	var image = new dv.Image('png', fs.readFileSync('./public/textpage300.png'));
	var tesseract = new dv.Tesseract('eng', image);
	var tesstext = tesseract.findText('plain')

	var thresimage = tesseract.thresholdImage().toBuffer(format="png")
	fs.writeFile('./tmpimages/textpage300_threshold.png', thresimage)

	// var src_path = path.resolve(thresimage)
	// var target_path = './tmpimages/textpage300_threshold_2.png'
	// fs.rename(src_path, target_path, function(err) {
 //        if (err) throw err;
 //        // delete the temporary file, so that the explicitly set temporary upload dir does not get filled with unwanted files
 //        // fs.unlink(thresimage, function() {
 //        //     if (err) throw err;
 //        //     // res.send('File uploaded to: ' + target_path + ' - ' + req.files.thumbnail.size + ' bytes');
 //        // });
 //    });

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
		var targetPath4threshold = './tmpimages/'+imagefilename+'.png';
		switch(files.myfile.type) {
			case 'image/jpeg':
				imagetype='jpg'
				// targetPath = './tmpimages/'+imagefilename+'.jpg'
				// targetPath4threshold = './tmpimages/'+imagefilename+'.jpg'
				break;
			case 'image/gif':
				imagetype='gif'
				// targetPath = './tmpimages/'+imagefilename+'.gif'
				// targetPath4threshold = './tmpimages/'+imagefilename+'.gif'
				break;
			default:
				imagetype='png'
				// targetPath = './tmpimages/'+imagefilename+'.png'
				// targetPath4threshold = './tmpimages/'+imagefilename+'.png'
		}
		targetPath = './tmpimages/'+imagefilename+'.'+imagetype
		targetPath4threshold = './tmpimages/'+imagefilename+'_threshold.'+imagetype

		//Save Uploaded file to temp folder 
		fs.rename(tempPath, path.resolve(targetPath), function(err) {
            if (err) throw err;
            console.log("Upload completed!");

            //Handle OCR Processing
    	  	var image = new dv.Image(imagetype, fs.readFileSync(targetPath));
			var tesseract = new dv.Tesseract(langcode, image);
			var tesstext = tesseract.findText('plain')
			console.log(tesstext);

			// Log OCR Image (Threshold Ones)
			var thresimage = tesseract.thresholdImage().toBuffer(format=imagetype)
			fs.writeFile(targetPath4threshold, thresimage)

			//Make Response Datas
			res.send({ocrtext:tesstext,ocrfile:targetPath,ocrthresfile:targetPath4threshold,ocrlang:langcode})
		  	// res.render('ocrtext', { title: 'OCR', ocrtext:tesstext ,ocrfile:'./tmpimages/image.jpg'});

        });

		



    });

});

router.get('/upload', function(req, res) {
  	res.render('upload', { title: 'Upload' });
});

module.exports = router;
