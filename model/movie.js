var mongoose = require('mongoose');
var Schema = require('mongoose').Schema;
var deepPopulate = require('mongoose-deep-populate')(mongoose);

var MovieSchema = new Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    release_date: {
        type: String
    },
    plot: {
        type: String,
        trim: true
    },
    image: {
        type: String,
        trim: true
    },
    cast: [{type: mongoose.Schema.ObjectId, ref: 'Actor'}],
    producer: {type: mongoose.Schema.ObjectId, ref: 'Producer'}
});

MovieSchema.plugin(deepPopulate);


module.exports = mongoose.model('Movie', {
    name: {
        type: String,
        required: true,
        trim: true
    },
    release_date: {
        type: String
    },
    plot: {
        type: String,
        trim: true
    },
    image: {
        type: String,
        trim: true
    },
    cast: [{type: mongoose.Schema.ObjectId, ref: 'Actor'}],
    producer: {type: mongoose.Schema.ObjectId, ref: 'Producer'}
});

// module.exports = {Movie};
