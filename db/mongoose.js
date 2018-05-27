var mongoose = require('mongoose');

mongoose.Promise = global.Promise;
// mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/MovieDB');
mongoose.connect('mongodb://admin:admin@ds135810.mlab.com:35810/aman-moviedb');
module.exports = {mongoose};
