var express = require('express');
var router = express.Router();
var functions = require('./functions');
var verifyToken = require('../security/security').verifyToken;

router.route('/:id')
    .get(async (req, res, next) => {
        let people = await functions.people_mayknow(req.params.id);
        res.status(200).json(people);
    });

router.route('/friendship/:id')
    .get(async (req, res, next) => {
        let people = await functions.get_friendship(req.params.id);
        res.status(200).json(people);
    });

module.exports = router;