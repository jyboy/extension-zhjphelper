var express = require('express');
var router = express.Router();
var moment = require('moment');
var sqlite3 = require('sqlite3').verbose();

var db = new sqlite3.Database('zhjp.sqlite3');

router.post('/', function(req, res, next) {
    var data = {
        status: "success"
    };
    db.run("INSERT INTO reservation (drivingSchool, reservationDate, firstCoach, secondCoach, firstTime, secondTime, canTwoTime, startTime) VALUES ($drivingSchool, $reservationDate, $firstCoach, $secondCoach, $firstTime, $secondTime, $canTwoTime, $startTime)", {
        $drivingSchool: req.body.drivingSchool,
        $reservationDate: req.body.reservationDate,
        $firstCoach: req.body.firstCoach,
        $secondCoach: req.body.secondCoach,
        $firstTime: req.body.firstTime,
        $secondTime: req.body.secondTime,
        $canTwoTime: req.body.canTwoTime,
        $startTime: moment().format('YYYY-MM-DD HH:mm:ss')
    }, function(err) {
        if (err) {
            data.status = "fail";
        }
        res.send(JSON.stringify(data));
    });
});

module.exports = router;