var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var expressValidator = require('express-validator');
var passport = require('passport');
var helmet = require('helmet')
require('./models/index');
require('./core/passport');

// var routes = require('./routes/index');
// var users = require('./routes/users');
var apiRoute = require('./api/index');

var app = express();

// view engine setup
// app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(passport.initialize());
app.use(logger('dev'));
app.use(helmet());
app.use(bodyParser.json());
app.use(expressValidator(require('./core/requestOptions')));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/api', apiRoute);
// app.use('/users', users);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  var fs = require('fs');
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
    // if(res.status==500) {
      fs.writeFile('logs/' + Date.now(), JSON.stringify({message:err.message, stacktrace: err.stack}), {flag:'wx'}, function(err) {
        // console.log("Logged error");
      });
    // }
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
