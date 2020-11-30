var express = require('express');
var router = express.Router();
var functions = require('./functions');
let connection = require('../database');
var verifyToken = require('../security/security').verifyToken;

/* GET users listing. */
router.get('/', function (req, res, next) {
    res.send('respond with a resource');
});

router.post('/friends', async (req, res, next) => {
    let querystring = `select distinct u.id_user, u.username, u.full_name,u.user_picture_key, u.user_picture_location, u.active, u.bot, f.id_friendship  from user u, friendship f
    where u.id_user = f.friend1
    and f.confirmed = 1
    and f.friend2 = ${req.body.id_user}
    union
    (
    select distinct u.id_user, u.username, u.full_name,u.user_picture_key, u.user_picture_location, u.active, u.bot, f.id_friendship  from user u, friendship f
    where u.id_user = f.friend2
    and f.confirmed = 1
    and f.friend1 = ${req.body.id_user}
    )`
    connection.query(querystring, (err, rows) => {
        if (err) {
            res.status(404).json({message: "Friends not found."})
        } else {
            res.status(200).json({message: "", data: rows})
        }
    });
});

router.post('/conversation', async (req, res, next) => {
    let querystring = `select * from message where id_friendship=${req.body.id_friendship}`
    connection.query(querystring, (err, rows) => {
        //onsole.log(err);
        //console.log(rows);
        if (err) {
            res.status(404).json({message: "Messages not found."})
        } else {
            res.status(200).json({message: "", data: rows})
        }
    });
});

module.exports = router;
