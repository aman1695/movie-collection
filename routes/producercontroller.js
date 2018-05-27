var express = require('express');
var path = require('path');
var router = express.Router();
var {mongoose} = require('../db/mongoose');
var Producer = require('../model/producer');

var router = express.Router();


router.get('/', function (req, res, next) {

    Producer.find({}, function (err, docs) {

        if (docs) {
            docs.forEach(doc => {
                if(doc.sex == 'M')  doc.sex = 'Male';
                else doc.sex = 'Female';
            });
            return res.render('producer.hbs', {title: 'Add Producer', producers: docs});
        }
        return res.render('producer.hbs', {title: 'Add Producer', producers: []});

    })

});

router.get('/producer/:id', function (req, res, next) {

    Producer.findById(req.params.id, function (err, producer) {

        if (err) {
            return res.status(404).send("did not found requested producer");
        }
        if(producer.sex == 'M')  producer.sex = 'Male';
        else producer.sex = 'Female';
        return res.render('producerDetail.hbs', {producer:producer});
    });

});

router.get('/addProducer', function (req, res) {
    res.render('addProducer.hbs');
});


/*  Add Producer to MongoDB DataBase*/
router.post('/addProducer', function (req, res) {
    // console.log(req.files);
    // console.log(req.body);
    var name = req.body.name;
    var sex = req.body.sex;
    var dob = req.body.dob;
    var bio = req.body.bio;
    var image = undefined
    if (req.files && req.files.file) {
        console.log(req.files);
        var file = req.files.file;
        var ext = path.extname(file.name);
        if (ext !== '.png' && ext !== '.jpg' && ext !== '.gif' && ext !== '.jpeg') {
            res.send({
                error: {
                    file: 'Only image files allowed'
                }
            });
            return;
        }
        file.mv(path.join('./public/images', file.name), function (err) {
            if (err) {
                return res.send({
                    error: {
                        file: 'Error uploading file'
                    }
                });
            }
            image = path.join('/images', file.name)
            // console.log("image inside", image);
            var actor = new Producer({
                name: name,
                sex: sex,
                dob: dob,
                bio: bio,
                image: image
            });

            Producer.findOne({name: name, dob: dob}, function (err, actorDoc) {
                if (err) {
                    return res.status(400).send({
                        error: {
                            message: 'Error while saving Producer'
                        }
                    });
                } else {
                    if (actorDoc) {
                        return res.status(400).send({
                            error: {
                                message: 'Producer already present with name ' + name + " and dob " + dob
                            }
                        });
                    }
                    actor.save(function (err, actor) {
                        if (err) {
                            return res.status(400).send({
                                error: {
                                    message: 'Error while saving Producer'
                                }
                            });
                        }
                        return res.redirect('/producers');
                    });
                }

            });

        });
    } else {
        // console.log("image out side", image);
        var actor = new Producer({
            name: name,
            sex: sex,
            dob: dob,
            bio: bio,
            image: ''
        });
        Producer.findOne({name: name, dob: dob}, function (err, actorDoc) {
            if (err) {
                return res.status(400).send({
                    error: {
                        message: 'Error while saving Producer'
                    }
                });
            } else {
                if (actorDoc) {
                    return res.status(400).send({
                        error: {
                            message: 'Producer already present with name' + name + "and dob " + dob
                        }
                    });
                }
                producer.save(function (err, producer) {
                    if (err) {
                        return res.status(400).send({
                            error: {
                                message: 'Error while saving Producer'
                            }
                        });
                    }
                    return res.redirect('/producers');
                });
            }

        });
    }

    // res.send('Added');
});

router.get('/updateProducer/:id', function (req, res) {
    Producer.findById(req.params.id, function (err, producer) {
        if (err) {
            return res.stat(404).send("did not found requested producer");
        }
        return res.render('updateProducer.hbs', {id:producer._id, name: producer.name, dob: producer.dob, bio: producer.bio, sex: producer.sex});
    });
});

/* Update */
router.post('/updateProducer/:id', function (req, res) {
    // console.log(req.files);
    // console.log(req.body);
    var name = req.body.name;
    var sex = req.body.sex;
    var dob = req.body.dob;
    var bio = req.body.bio;
    var image = undefined

    var obj = {
        name: req.body.name,
        sex: req.body.sex,
        dob: req.body.dob,
        image: undefined,
        bio: req.body.bio,
    };
    if (req.files && req.files.file) {
        console.log(req.files);
        var file = req.files.file;
        var ext = path.extname(file.name);
        if (ext !== '.png' && ext !== '.jpg' && ext !== '.gif' && ext !== '.jpeg') {
            res.send({
                error: {
                    file: 'Only image files allowed'
                }
            });
            return;
        }
        file.mv(path.join('./public/images', file.name), function (err) {
            if (err) {
                return res.send({
                    error: {
                        file: 'Error uploading file'
                    }
                });
            }
            image = path.join('/images', file.name)
            obj.image = image;
            obj = JSON.parse(JSON.stringify(obj));
            console.log(obj);
            Producer.findByIdAndUpdate(req.params.id, obj, function (err, actor) {
                if (err || !actor) {
                    return res.status(404).send("Request producer not found");
                }
                res.redirect('/producers');
            });
        });
    } else {
        obj = JSON.parse(JSON.stringify(obj));
        console.log("obj:", obj);
        Producer.findByIdAndUpdate(req.params.id, obj, function (err, actor) {
            if (err || !actor) {
                return res.status(404).send("Request producer not found");
            }
            res.redirect('/producers');
        });

    }

    // res.send('Added');
});


/* Delete */
router.put('/deleteProducer/:id', function (req, res) {
    Producer.findByIdAndRemove(req.params.id, function (err, actor) {
        if (err) {
            return res.status(400).send({
                error: {
                    message: 'Error while deleting Producer'
                }
            });
        }
    })
});

module.exports = router;