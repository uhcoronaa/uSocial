var express = require('express');
var router = express.Router();
var lexruntime = require('../private/lex_aws').lex;

router.post('/', async (req, res, next) => {
    var params = {
        botAlias: 'usocial',
        botName: 'usocial',
        inputText: req.body.message,
        userId: 'u' + req.body.user
    };

    lexruntime.postText(params, function (err, data) {
        if (err) res.status(500).json({ error: err })
        else res.status(200).json({ message: data.message });           // successful response
    });

});

module.exports.router = router;
module.exports.lex = function(req) {
    return new Promise((resolve, reject) => {
        var params = {
            botAlias: 'usocial',
            botName: 'usocial',
            inputText: req.message,
            userId: 'u' + req.user
        };
    
        lexruntime.postText(params, function (err, data) {
            if (err) resolve({ status: 500, error: err })
            else resolve({ status: 200, message: data.message });           // successful response
        });
    })
}