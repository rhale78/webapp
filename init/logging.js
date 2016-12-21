module.exports = function (app) {
    var express = require('express');
    var logger = require('morgan');
    var FileStreamRotator = require('file-stream-rotator');
    var FileSystem = require('fs');
    var path = require('path');

    var logDirectory = path.join(__dirname, 'log');
    FileSystem.existsSync(logDirectory) || FileSystem.mkdirSync(logDirectory);

    var logStream = FileStreamRotator.getStream({
        date_format:'YYYYMMDD',
        filename: path.join(logDirectory, 'access-%DATE%.log'),
        frequency: 'daily',
        verbose: true
    });

    var uuid = require('uuid');

    logger.token('id', function getId(request) {
        return request.id;
    });

    app.use(assignId);

    //app.use(logger('dev'));
    var logFormat = ':date[iso] :id :method :url :status :response-time[4] ms - :res[content-length] :referrer :remote-addr :remote-user';
    app.use(logger(logFormat, { stream: logStream }));
    app.use(logger(logFormat));

    function assignId(request, resource, next) {
        request.id = uuid.v4();
        next();
    }
}