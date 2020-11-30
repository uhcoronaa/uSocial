var express = require('express');
var router = express.Router();
var functions = require('./functions');
var verifyToken = require('../security/security').verifyToken;

router.route('/')
    .put(async (req, res, next) => {
        await functions.update_friendship(req.body);
        res.status(200).json({ res: 'Se agrego correctamente a tu amigo' });
    })
    .post(async (req, res, next) => {
        await functions.add_friend(req.body);
        res.status(200).json({ res: 'Se envio correctamente la solicitud de amistad a tu amigo' });
    });

module.exports = router;