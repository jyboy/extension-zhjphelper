var express = require('express');
var logger = require('morgan');
var bodyParser = require('body-parser');
var http = require('http');
var index = require('./routes/index');

var app = express();

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));

app.use('/', index);

app.set('port', process.env.PORT || 3002);
app.set('host', '127.0.0.1');
var server = http.createServer(app).listen(app.get('port'), app.get('host'), function() {
    console.log("Express server listening on port " + app.get('port')　 + " at host " + app.get('host'));
    console.log("zhjp_helper server, please do not close!");
});

app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

app.use(function(err, req, res, next) {
    res.status(err.status || 500);
});


module.exports = app;
