var express = require('express');
var router = express.Router();
var functions = require('./functions');
let connection = require('../database');

router.post('/publish', async (req, res, next) => {
    try {
        var r = await functions.create_publishing(req.body)
        res.status(r.status).json({ message: r.message });
    }
    catch (err) {
        next(err);
    }
});

router.post('/publishings', async (req, res, next) => {
    let queryString = `select u.full_name, u.username, p.* from publishing p, user u where p.id_user = u.id_user
        and p.id_user in (
        select distinct u.id_user from user u, friendship f
        where u.id_user = f.friend1
        and f.confirmed = 1
        and f.friend2 = ${req.body.id_user}
        union
        (
        select distinct u.id_user  from user u, friendship f
        where u.id_user = f.friend2
        and f.confirmed = 1
        and f.friend1 = ${req.body.id_user}
        ) union (
            select ${req.body.id_user}
        )
        )
        order by date desc`
    connection.query(queryString, (err, rows, fields) => {
        if (err) {
            res.status(500).json({ message: "Error to get publishings" })
        } else {
            res.status(200).json({ message: "All ok", data: rows })
        }
    });
});

module.exports = router;