var mongoose = require('mongoose');

module.exports = mongoose.model('Producer', {
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

// module.exports = {Producer};
