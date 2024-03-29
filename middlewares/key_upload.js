/**
 * Created by LENOVO on 10-04-2018.
 */

var multer=require("multer");
var storage=multer.diskStorage({
    destination: function (req,file,cb) {
        cb(null,'./storage/verifierkey/');
    },
    filename: function (req,file,cb) {
        cb(null,new Date().toISOString().replace(/:/g, '-')+ file.originalname);
    }
});

var filefilter= function (req,file,cb) {
  //rejecting a file
    // if(file.mimetype === 'plain/text'){
    //     cb(null,true);
    // }else {
    //     cb(null,false);
    // }
    cb(null,true);
};
exports.upload=multer({
    storage:storage,
    limits: {
        filesize: 1024*1025*5
    },
    fileFilter: filefilter
});
