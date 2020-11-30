const jwt = require('jsonwebtoken')
const secretkey = 'secretkey'

function verifyToken(req, res, next) {
    if(!req.headers.authorization) {
        return res.status(401).json({
            message: 'Unauthorized Request'
        });
    }

    const token = req.headers.authorization.split(' ')[1]
    if(token == 'null') {
        return res.status(401).send({
            message: 'Unauthorized Request'
        });
    }

    //const payload = jwt.verify(token, secretkey)
    //console.log(payload);
    //req.userId = payload._id
    next()
}

function createToken(data){
    jwt.sign(data, secretkey)
}

//export { createToken, verifyToken };
module.exports.verifyToken = verifyToken;