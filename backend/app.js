var createError = require('http-errors');
var express = require('express');
var cors = require('cors');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var notificationRouter = require('./routes/notification');
var friendshipRouter = require('./routes/friendship');
var peopleRouter = require('./routes/people');
var chatbotRouter = require('./routes/chatbot');

var cors = require('cors');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(cors());
app.use(logger('dev'));
//app.use(express.json());
//app.use(express.urlencoded({ extended: false }));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true, parameterLimit: 50000 }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
//app.use('/chatbot', chatbotRouter);
app.use('/users', usersRouter);
app.use('/friends', require('./routes/friends'));
app.use('/publishings', require('./routes/publishings'));
app.use('/filters', require('./routes/filters'));
app.use('/notification', notificationRouter);
app.use('/friendship', friendshipRouter);
app.use('/people', peopleRouter);
app.use('/translate', require('./routes/translate'));

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
