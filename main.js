var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var sessions = require('client-sessions');
var bcrypt = require('bcryptjs');
var passport = require('passport');
var setupPassport = require('./functions/setup-passport');
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

//connect to mongoDB
// var MONGO_URI = require('./config/mongo').MONGO_URI;
mongoose.connect('mongodb://localhost/auth');
// mongoose.connect(MONGO_URI);

//setup passport: serialize(), deserialize(), .use()
setupPassport(app, passport);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hjs');

// mongoose.connect('mongodb://heroku_app37225823:suvhb017btosa6ldjd2qgtsvq0@ds041032.mongolab.com:41032/heroku_app37225823');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(require('less-middleware')(path.join(__dirname, 'public')));
app.use(passport.initialize());
app.use(passport.session());
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
app.use(updateSession);

// always update session in case current user
// logs out and another different user logs in
function updateSession (req, res, next) { //user next() for next middleware

  console.log('\n\n');
  console.log("in updateSesion()");
  console.log('\n\n');

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
      // res.redirect('/dashboard');
      next();
    });
  } else {
    console.log('req.session or req.session.user is false');
    next();
  }
}

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
//facebook logins
app.get('/auth/facebook', passport.authenticate('facebook', { 
  scope : 'email' 
})
// , function (req, res) {
//   res.redirect('dashboard');
// }
);

app.get('/auth/facebook/callback', 
  passport.authenticate('facebook'), 
  // redirectToDashboard
  redirectToMain
);

// function redirectToDashboard (req, res) {
function redirectToMain (req, res) {

  console.log('redirecting to dashboard');
  console.log('res: ' + res);
  console.log('req: ' + req);
  console.log(req.user.displayName);

  User.findOne({ email : req.user.emails[0].value }, function (err, user) {
    if (!err) {
      if (user) {

        // TEST
        console.log('');
        console.log('req.user:');
        console.log(req.user);
        console.log('req.session.user:');
        console.log(req.session.user);
        console.log('req.session:');
        console.log(req.session);
        console.log('');


        req.session.user = user;
        console.log('req.session.user:');
        console.log(req.session.user);
        console.log('redirect to dashboard');
        // res.redirect('/dashboard');
        res.redirect('/');
      } else if (req.user || req.session.user) {
        
        // TEST
        console.log('');
        console.log('req.user:');
        console.log(req.user);
        console.log('req.session.user:');
        console.log(req.session.user);
        console.log('req.session:');
        console.log(req.session);
        console.log('');

        res.redirect('/');
      } else {
        console.log('error: no user found');
        res.send('error: no user found');
      }
    } else {
      console.log('Error: ' + err);
      res.send('Error: ' + err);
    }
  });
}

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