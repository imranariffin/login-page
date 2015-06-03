var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var sessions = require('client-sessions');
var bcrypt = require('bcryptjs');
//mongoDB setup
var mongoose = require('mongoose');
var Schema = require('./schemas/schemas.js');
var User = Schema.User;

var routes = require('./routes/index');
var users = require('./routes/users');
var register = require('./routes/register');
var login = require('./routes/login');
var dashboard = require('./routes/dashboard');
var reset = require('./routes/reset');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hjs');

//connect to mongoDB
mongoose.connect('mongodb://localhost/auth');
// mongoose.connect('mongodb://heroku_app37225823:suvhb017btosa6ldjd2qgtsvq0@ds041032.mongolab.com:41032/heroku_app37225823');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(require('less-middleware')(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public')));

//middlewares

//oauth session
app.use(sessions({
  cookieName : 'session',
  secret : 'kafljslafio134asfjasoasdfasdfsdfdf',
  duration : 30 * 60 * 1000,
  activeDuration : 5 * 60 * 1000
}));

//always update session
app.use(function (req, res, next) {
  if (req.session && req.session.user) {
    User.findOne({ email : req.session.user.email }, function (err, user) {
      if (user) {
        req.user = user;
        delete req.user.password;
        req.session.user = req.user;
        res.locals.user = req.user;
        console.log('session updated');
      }
      console.log('user is false');
      next();
    });
  } else {
    console.log('req.session or req.session.user is false');
    next();
  }
});

app.use('/', routes);
app.use('/users', users);
app.use('/register', register);
app.use('/login', login);
app.use('/dashboard', dashboard);
app.use('/logout', function (req, res) {
  req.session.reset();
  res.redirect('/');
});
app.use('/reset', reset);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
