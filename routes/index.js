const express = require('express');
const path = require('path')
const fs = require('fs')
var serveIndex = require('serve-index')

const router = express.Router();

const uploadPath = './uploads/'

const multer = require('multer');
const storage = multer.diskStorage({
  destination: uploadPath,
  filename: function (req, file, cb) {
    let newName = `${Date.now()}${path.extname(file.originalname)}`
    cb(null, newName)
  }
});

var upload = multer({storage:storage})

/* GET home page. */
router.use('/ftp', express.static('./uploads'), serveIndex('./uploads', {'icons': true}))

router.use('/upload', upload.single('screenshot'), (req,res)=> {

  let dirname = req.body.dirname || "unknown"
  let filename = req.file.filename
  let sourcePath = path.join(uploadPath,filename)
  let destinationDir = path.join(uploadPath,dirname)

  if (!fs.existsSync(destinationDir)){
    fs.mkdirSync(destinationDir);
  }

  fs.rename(sourcePath,path.join(destinationDir,filename),function(err){
    console.log(err)
  })


  if(req.uploadErr) {
    console.log(req.uploadErr)
  }

  res.send("Uploaded Successfully")
})

router.get('*', function(req, res){
  res.status(404).send('what???');
})

module.exports = router;
