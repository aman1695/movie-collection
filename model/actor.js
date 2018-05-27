var mongoose = require('mongoose');
var deepPopulate = require('mongoose-deep-populate')(mongoose);
var Schema = require('mongoose').Schema;

var ActorSchema = new Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    sex: {
        type: String,
        required: true,
        trim: true
    },
    dob: {
        type: String
    },
    bio: {
        type: String,
        trim: true
    },
    image: {
        type: String,
        trim: true
    }
});

ActorSchema.plugin(deepPopulate);
/*var Actor*/ module.exports = mongoose.model('Actor', ActorSchema);

// var actor = new Actor();
// console.log("actor", actor);
//
// module.exports = {Actor};
