var express = require('express');
var path = require('path');
var router = express.Router();

router.post('/', function (req, res, next) {
    if (!req.files) {
        return res.status(400).send('No files were uploaded.');
    }

    var file = req.files.file;
    var ext = path.extname(file.name)
    if (ext !== '.png' && ext !== '.jpg' && ext !== '.gif' && ext !== '.jpeg') {
        res.send({
            error: 'Only image files allowed'
        });
        return;
    }
    file.mv(path.join('./public/images', file.name), function (err) {
       if (err) {
           return res.send({
               error: 'Error occurred'
           });
       }
       res.send({
           id: path.join('images', file.name)
       });
    });



});

module.exports = router;
