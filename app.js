const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const expressValidator = require('express-validator');
const passport = require('passport');
const helmet = require('helmet');
const Raven = require('raven');

Raven.config(process.env.__DSN__).install();

global.config = require('./config/global');

require('./models/index');
require('./core/passport');

var apiRoute = require('./api/index');

var app = express();

// Error reporting setup
app.use(Raven.requestHandler());

// view engine setup
// view engine goes here.

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(passport.initialize());
app.use(logger('dev'));
app.use(helmet());
app.use(bodyParser.json());
app.use(expressValidator(require('./core/requestOptions')));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'jvent-frontend/public')));

app.use('/api', apiRoute);

app.use(Raven.errorHandler());

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
    const fse = require('fs-extra');
    app.use(async function(err, req, res, next) {
        res.status(err.status || 500);
        res.json({
            message: err.message,
            error: err.stack
        });
        await fse.outputFile(`logs/${Date.now()}`, JSON.stringify({message:err.message, stacktrace: err.stack}), {flag:'wx'});
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.json({
        message: err.message,
        error: {}
    });
});


module.exports = app;
