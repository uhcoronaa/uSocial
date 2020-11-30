var express = require('express');
var router = express.Router();
let connection = require('../database');
var verifyToken = require('../security/security').verifyToken;

router.get('/filters', async (req, res, next) => {
    let queryString = `select * from tag`
    connection.query(queryString, (err, rows, fields) => {
        if (err) {
            res.status(500).json({ message: "Error to get publishings" })
        } else {
            res.status(200).json({ message: "All ok", data: rows })
        }
    });
});

router.get('/filters_publishing/:id', async (req, res, next) => {
    let queryString = `select id_publishing from publishing_tag where id_tag=${req.params.id}`
    connection.query(queryString, (err, rows, fields) => {
        if (err) {
            res.status(500).json({ message: "Error to get publishings" })
        } else {
            res.status(200).json({ message: "All ok", data: rows })
        }
    });
});

module.exports = router;