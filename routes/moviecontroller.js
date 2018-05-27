var express = require('express');
var path = require('path');
var router = express.Router();
var {mongoose} = require('../db/mongoose');
var Movie = require('../model/movie');
var Actor = require('../model/actor');
var Producer = require('../model/producer');
var deepPopulate = require('mongoose-deep-populate')(mongoose);

var router = express.Router();


router.get('/', function (req, res) {

    console.log(req.url);

    Movie.find().populate({path: 'cast', model: Actor}).populate({
        path: 'producer',
        model: Producer
    }).exec(function (err, movies) {
        console.log(JSON.stringify(movies, null, 2));
        res.render('movies.hbs', {title: 'Movie', movies: movies});
    });

    // Movie.find({}, function (err, movDocs) {
    //     var movies = movDocs || [];
    //     Producer.find({}, function (err, prodDocs) {
    //         if (err) {
    //             return res.send({
    //                 error: {
    //                     file: 'Only image files allowed'
    //                 }
    //             });
    //         }
    //         var producers = prodDocs || [];
    //         Actor.find({}, function (err, actDocs) {
    //             if (err) {
    //                 return res.send({
    //                     error: {
    //                         file: 'Only image files allowed'
    //                     }
    //                 });
    //             }
    //             var actors = actDocs || [];
    //             return res.render('movies.hbs', {title: 'Add Actor', producers: producers, actors: actors, movies: movies});
    //         });
    //     });
    // });


    // res.render('movies.hbs', {title: 'Add Movie'});

});

router.get('/addMovie', function (req, res) {

    producers = [];
    actors = [];
    Producer.find({}, function (err, prodDocs) {
        producers = prodDocs || [];
        Actor.find({}, function (err, actorDocs) {
            actors = actorDocs || [];
            return res.render('addMovie.hbs', {title: "Add Movie", actors: actors, producers: producers});

        });
    });
    // res.render('addMovie.hbs');

});

router.post('/addMovie', function (req, res) {
    console.log(req.files);
    console.log(req.body);
    var name = req.body.name;
    var release_date = req.body.release_date;
    var plot = req.body.plot;
    var image = undefined;
    var cast = req.body.cast;
    var producer = req.body.producer;
    if (!Array.isArray(cast)) {
        cast = new Array(cast);
    }
    casts = []
    cast.forEach(actor => {
        casts.push(mongoose.Types.ObjectId(actor));
    });

    console.log(casts);

    producer = mongoose.Types.ObjectId(producer);


    console.log(producer);

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
            var movie = new Movie({
                name: name,
                release_date: release_date,
                plot: plot,
                image: image,
                cast: casts,
                producer: producer
            });

            Movie.findOne({name: name, release_date: release_date}, function (err, movDoc) {
                if (err) {
                    return res.status(400).send({
                        error: {
                            message: 'Error while saving Movie'
                        }
                    });
                } else {
                    if (movDoc) {
                        return res.status(400).send({
                            error: {
                                message: 'Movie already present with name ' + name + " and dob " + release_date
                            }
                        });
                    }
                    movie.save(function (err, movie) {
                        if (err) {
                            return res.status(400).send({
                                error: {
                                    message: 'Error while saving Movie'
                                }
                            });
                        }
                        return res.redirect('/');
                    });
                }

            });

        });
    } else {
        // console.log("image out side", image);
        var movie = new Movie({
            name: name,
            release_date: release_date,
            plot: plot,
            image: '',
            cast: casts,
            producer: producer
        });
        Movie.findOne({name: name, release_date: release_date}, function (err, movDoc) {
            if (err) {
                return res.status(400).send({
                    error: {
                        message: 'Error while saving Movie'
                    }
                });
            } else {
                if (movDoc) {
                    return res.status(400).send({
                        error: {
                            message: 'Movie already present with name ' + name + " and dob " + release_date
                        }
                    });
                }
                movie.save(function (err, actor) {
                    if (err) {
                        return res.status(400).send({
                            error: {
                                message: 'Error while saving Movie'
                            }
                        });
                    }
                    return res.redirect('/');
                });
            }

        });
    }

    // res.send('Added');
});

router.get('/deleteMovie/:id', function (req, res) {

    Movie.findByIdAndRemove(req.params.id, function (err, _) {
        if (err) {
            return res.status(500).send("Error while deleting Movie");
        }
        return res.redirect('/');
    })

});

router.get('/updateMovie/:id', function (req, res) {

    Producer.find({}, function (err, prodDocs) {
        producers = prodDocs || [];
        Actor.find({}, function (err, actorDocs) {
            actors = actorDocs || [];
            // return res.render('addMovie.hbs', {title: "Add Movie", actors:actors, producers:producers});
            Movie.findById(req.params.id, function (err, movie) {
                console.log(movie);
                if (err) {
                    return res.stat(404).send("did not found requested movie");
                }
                var renderObj = {
                    title: "Update Movie",
                    id: movie._id,
                    name: movie.name,
                    release_date: movie.﻿release_date,
                    plot: movie.plot,
                    actors: actors,
                    producers: producers
            };
                return res.render('updateMovie', renderObj);
            });

        });
    });

});

router.post('/updateMovie/:id', function (req, res) {

    var cast = req.body.cast;
    console.log(req.body);
    var producer = mongoose.Types.ObjectId(req.body.producer);
    if (!Array.isArray(cast)) {
        cast = new Array(cast);
    }
    casts = []
    cast.forEach(actor => {
        casts.push(mongoose.Types.ObjectId(actor));
    });

    if(casts.length == 0) casts = undefined;

    var obj = {
        name: req.body.name,
        release_date: req.body.release_date,
        plot: req.body.plot,
        image: undefined,
        cast: casts,
        producer: producer
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
            Movie.findByIdAndUpdate(req.params.id, obj, function (err, movie) {
                if (err || !movie) {
                    return res.status(404).send("Request movie not found");
                }
                res.redirect('/');
            });



        });
    } else {
        obj = JSON.parse(JSON.stringify(obj));
        console.log("obj:", obj);
        Movie.findByIdAndUpdate(req.params.id, obj, function (err, movie) {
            if (err || !movie) {
                return res.status(404).send("Request movie not found");
            }
            res.redirect('/');
        });
    }






});

module.exports = router;
