var express = require('express');
var router = express.Router();
var functions = require('./functions');
var verifyToken = require('../security/security').verifyToken;

/* GET users listing. */
router.get('/', function (req, res, next) {
  res.send('respond with a resource');
});

router.get('/getuserinfo/:id', verifyToken, async (req, res, next) => {
  let user_info = await functions.get_user_by_id(req.params.id);
  res.statusCode = 200;
  res.setHeader('Content-Type', 'application/json');
  res.json(user_info);
});

router.post('/signup', async (req, res, next) => {
  try {
    if (!await functions.user_exist(req.body.username)) {
      let result = await functions.create_user(req.body);
      if (result.res1) {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(result);
      }
    }
    else {
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.json({ res1: false, res2: null, res3: "Este nombre de usuario ya esta ocupado" });

    }
  }
  catch (err) {
    next(err);
  }
});

router.post('/login', async (req, res, next) => {
  //let loginfo2 = await functions.login_cognito(req.body);
  try {
    let loginfo = await functions.login(req.body);
    let loginfo2 = await functions.login_cognito(req.body);
    if (loginfo.res1 && loginfo2.status) {
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.json({ res1: 1, res2: 'Successful Login', token: loginfo.res2, sessiontoken: loginfo2.data });
    }
    else {
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.json({ res1: 0, res2: 'Failed Login' });
    }
  }
  catch (err) {
    next(err);
  }
});

router.post('/updateinfo', verifyToken, async (req, res, next) => {
  //let l =  await functions.update_user_cognito(req.body.data)
  try {
    //var r = await functions.validate_user(req.body.data);
    var l =  {status: true};
    if(req.body.data.user_password != ""){
      l = await functions.update_user_cognito(req.body.data)
    }
    if (l.status) {
      if (await functions.update_user(req.body.data)) {
        res.status(200).json({ res: 'User info was update Successfully!!' });
      } else {
        res.status(501).json({ res: 'Error to update info' });
      }
    } else {
      res.status(500).json({ res: "Error in credentias" });
    }
  }
  catch (err) {
    console.log(err);
    next(err);
  }
});

router.post('/updateimage', verifyToken, async (req, res, next) => {
  try {
    if (await functions.user_exist(req.body)) {
      if (await upload_s3_file(req.body.image_base64, req.body.username)) {
        res.status(200).json({ res: 'User image was update Successfully!!' });
      } else {
        res.status(404).json({ res: 'Error to update image' });
      }
    } else {
      res.status(404).json({ res: "User not found!!!" });
    }
  }
  catch (err) {
    next(err);
  }
});

router.post('/getinfo', verifyToken, async (req, res, next) => {
  try {
    var rows = await functions.get_user(req.body.id_user);
    if (!rows.found) {
      res.status(404).json({ res: 'User not found!!' });
    } else {
      res.status(200).json({ res: 'User found!!', data: rows.rows });
    }
  }
  catch (err) {
    next(err);
  }
});

module.exports = router;