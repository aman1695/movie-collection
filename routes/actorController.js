var express = require('express');
var path = require('path');
var router = express.Router();
var {mongoose} = require('../db/mongoose');
var Actor = require('../model/actor');

var router = express.Router();


router.get('/', function (req, res, next) {

    Actor.find({}, function (err, docs) {

        if (docs) {
            docs.forEach(doc => {
               if(doc.sex == 'M')  doc.sex = 'Male';
               else doc.sex = 'Female';
            });
            return res.render('actor.hbs', {title: 'Add Actor', actors: docs});
        }
        return res.render('actor.hbs', {title: 'Add Actor', actors: []});

    });

});

router.get('/actor/:id', function (req, res, next) {

    Actor.findById(req.params.id, function (err, actor) {

        if (err) {
            return res.stat(404).send("did not found requested actor");
        }
        if(actor.sex == 'M')  actor.sex = 'Male';
        else actor.sex = 'Female';
        return res.render('actorDetail.hbs', {actor:actor});
    });

});



router.get('/addActor', function (req, res) {
    res.render('addActor.hbs');
});

/*  Add Actor to MongoDB DataBase*/
router.post('/addActor', function (req, res) {
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
            var actor = new Actor({
                name: name,
                sex: sex,
                dob: dob,
                bio: bio,
                image: image
            });

            Actor.findOne({name: name, dob: dob}, function (err, actorDoc) {
                if (err) {
                    return res.status(400).send({
                        error: {
                            message: 'Error while saving Actor'
                        }
                    });
                } else {
                    if (actorDoc) {
                        return res.status(400).send({
                            error: {
                                message: 'Actor already present with name ' + name + " and dob " + dob
                            }
                        });
                    }
                    actor.save(function (err, actor) {
                        if (err) {
                            return res.status(400).send({
                                error: {
                                    message: 'Error while saving Actor'
                                }
                            });
                        }
                        return res.redirect('/actors');
                    });
                }

            });

        });
    } else {
        // console.log("image out side", image);
        var actor = new Actor({
            name: name,
            sex: sex,
            dob: dob,
            bio: bio,
            image: ''
        });
        Actor.findOne({name: name, dob: dob}, function (err, actorDoc) {
            if (err) {
                return res.status(400).send({
                    error: {
                        message: 'Error while saving Actor'
                    }
                });
            } else {
                if (actorDoc) {
                    return res.status(400).send({
                        error: {
                            message: 'Actor already present with name' + name + "and dob " + dob
                        }
                    });
                }
                actor.save(function (err, actor) {
                    if (err) {
                        return res.status(400).send({
                            error: {
                                message: 'Error while saving Actor'
                            }
                        });
                    }
                    return res.redirect('/actors');
                });
            }

        });
    }

    // res.send('Added');
});

router.get('/updateActor/:id', function (req, res) {
    Actor.findById(req.params.id, function (err, actor) {
        if (err) {
            return res.stat(404).send("did not found requested actor");
        }
        return res.render('updateActor.hbs', {id:actor._id, name: actor.name, dob: actor.dob, bio: actor.bio, sex: actor.sex});
    });
});

/* Update */
router.post('/updateActor/:id', function (req, res) {
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
            Actor.findByIdAndUpdate(req.params.id, obj, function (err, actor) {
                if (err || !actor) {
                    return res.status(404).send("Request actor not found");
                }
                res.redirect('/actors');
            });
        });
    } else {
        obj = JSON.parse(JSON.stringify(obj));
        console.log("obj:", obj);
        Actor.findByIdAndUpdate(req.params.id, obj, function (err, actor) {
            if (err || !actor) {
                return res.status(404).send("Request actor not found");
            }
            res.redirect('/actors');
        });

    }

    // res.send('Added');
});


/* Delete */
router.put('/deleteActor/:id', function (req, res) {
    Actor.findByIdAndRemove(req.params.id, function (err, actor) {
        if (err) {
            return res.status(400).send({
                error: {
                    message: 'Error while deleting Actor'
                }
            });
        }
    })
});

module.exports = router;