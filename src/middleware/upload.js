const multer = require("multer");
const path = require("path");
// const req = require("express/lib/request");
// const expre = require("")
//  Storage Function
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null ,path.join(__dirname,"../public/images"));
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = `${Date.now()}&${Math.random()*2300863000}`;
    cb(null, uniqueSuffix + "-" + file.originalname);
  },
});

// filter section
// console.log(path);
const fileFilter = (req, file, cb)=>{

  console.log(file.mimetype)
    if(file.mimetype === "image/jpeg" || file.mimetype === "image/png" || file.mimetype === "video/mp4"){
        // To accept the file pass `true`, like so:
        cb(null, true)
    }
    else{
        // To reject this file pass `false`, like so:
        cb(null, false)
    }

  };

const options = {
 storage,
 fileFilter, 
  limits: {
    fileSize: 1024083 * 10243 * 5,
  },
};

const upload = multer(options);

module.exports = upload;
