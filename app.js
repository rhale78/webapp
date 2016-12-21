var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var FileStreamRotator = require('file-stream-rotator');
var FileSystem = require('fs');

var app = express();

var index = require('./routes/index');
var users = require('./routes/users');
var api = require('./routes/api');

var logDirectory = path.join(__dirname, 'log');
FileSystem.existsSync(logDirectory) || FileSystem.mkdirSync(logDirectory);

var logStream = FileStreamRotator.getStream({
    date_format: 'YYYYMMDD',
    filename: path.join(logDirectory, 'access-%DATE%.log'),
    frequency: 'daily',
    verbose: false
});

var uuid = require('uuid');

logger.token('id', function getId(request) {
    return request.id;
});

app.use(assignId);

function assignId(request, resource, next) {
    request.id = uuid.v4();
    next();
}

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
var logFormat = ':id :date[iso] :method :url :status :response-time[4]ms :res[content-length] :referrer :remote-addr :remote-user';
app.use(logger(logFormat, { stream: logStream }));
app.use(logger(logFormat));

mongoose.connect('mongodb://localhost/nodejs_test');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);
app.use('/users', users);
app.use('/api', api);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error.ejs');
});

module.exports = app;
