var FacebookStrategy = require('passport-facebook').Strategy;
var config = require('../config/auth');
var Schema = require('../schemas/schemas.js');
var User = Schema.User;

function setupPassport (app, passport) {

  passport.serializeUser(function (user, done) {
    done(null, user);
  });
  passport.deserializeUser(function (obj, done) {
    done(null, obj);
  });

  //Facebook Strategy
  passport.use(new FacebookStrategy({
      clientID      : config.facebookAuth.clientID,
      clientSecret  : config.facebookAuth.clientSecret ,
      callbackURL   : config.facebookAuth.callbackURL
  },
    function (accessToken, refreshToken, profile, done) {
      process.nextTick(function () {
        console.log('succces: now time for db codes');

        console.log('in profile: ')
        for (i in profile) {
          var item = profile[i];
          console.log('item ' + i + ' ' + item);
        }

        console.log('profile.emails[0].value: ' + profile.emails[0].value);

        //find user using profile given be Facebook
        User.findOne({ 
          email : profile.emails[0].value 
        }, function (err, user) {
          //check for error
          if (err) {
            throw err;
          } 

          //if no error
          if (user) {
            //done
            console.log('success: user exists');
          } else {
            //update db with profile provided by Facebook
            console.log('success: user does not exist');
            console.log('update db');
            
            //create new user using profile info from Facebook
            var user = new User({
              // id : 'genericID'
              email     : profile.emails[0].value
              , firstName : profile._json['first_name']
              , lastName  : profile._json['last_name']
              , password  : 'password'
            });

            //update db
            user.save(function (err) {
              if (err) {
                console.log('err: ' + err);
              } else {
                console.log('save in db success');
                return done(null, profile);
              }
            });
          }
        });


        // save  accessToken
        // req.session.accessToken = accessToken;

        return done(null, profile);
      });
    }
  ));

  app.use(passport.initialize());
  app.use(passport.session());
}

module.exports = setupPassport;