var express = require('express');
var router = express.Router();
var translate = require('../private/translate_aws').translate;
var verifyToken = require('../security/security').verifyToken;

router.post('/translate', async (req, res, next) => {
    var params = {
        Text: req.body.text,
        SourceLanguageCode: 'auto',
        TargetLanguageCode: 'es'
    };
    translate.translateText(params,(err, data) => {
        if (err) {
            res.status(500).json({ message: "Error in translation" });
        }
        if (data) {
            res.status(200).json({ message: data.TranslatedText });
        }
    });
});

module.exports = router;