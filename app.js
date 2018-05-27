var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var Handlebar = require('hbs');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var uploadFile = require('./routes/upload-image');
var actorController = require('./routes/actorController');
var producerController = require('./routes/producercontroller');
var movieContriller = require('./routes/moviecontroller');
const fileUpload = require('express-fileupload');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
Handlebar.registerHelper('ifEquals', function (arg1, arg2, options) {
    return (arg1 == arg2) ? options.fn(this) : options.inverse(this);
});
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/images', express.static(__dirname + '/Images'));
app.use(fileUpload());
// app.use('/', indexRouter);
// app.use('/users', usersRouter);
app.use('/uploadImage', uploadFile);
app.use('/actors', actorController);
app.use('/producers', producerController);
app.use('/', movieContriller);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
