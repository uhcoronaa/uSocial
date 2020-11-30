var express = require('express');
var router = express.Router();
var functions = require('./functions');var verifyToken = require('../security/security').verifyToken;


router.route('/')
    .post(async (req, res, next) => {
        await functions.add_notification(req.body);
        res.status(200).json({ res: true });
    })
    .put(async (req, res, next) => {
        await functions.update_notification(req.body);
        res.status(200).json({ res: true });
    });

router.route('/:id')
    .get(async (req, res, next) => {
        let notifications = await functions.get_notication(req.params.id);
        res.status(200).json(notifications);
    })
    .delete(async (req, res, next) => {
        await functions.delete_notification(req.params.id);
        res.status(200).json({ res: 'Se acepto correctamente la solicitud de amistad' });
    });

module.exports = router;