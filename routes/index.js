
/*
 * GET home page.
 */

var fs = require('fs'),
  file,
  fileData;

exports.indexPOST = function(req, res){
  console.log("indexPOST");
  console.log(req.files.image.path);
  file = fs.readFile(req.files.image.path, function(err, data) {
    if (err) {
      console.log('upload failed: ');
      console.log(err);
      res.send({ error: err });
    } else {
      fileData = data;
      res.send({ success: "YES" });
    }
  });
};

exports.indexGET = function(req, res) {
  console.log("indexGET");
  if(fileData) {
    res.writeHead(200, {'Content-Type': 'image/jpeg' });
    res.end(fileData, 'binary');
  } else {
    res.writeHead(404);
    res.end('no image could be found');
  }
};
