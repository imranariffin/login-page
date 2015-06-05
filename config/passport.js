
var FacebookStrategy = require('passport-facebook').Strategy;

//load user model
User = require('../schemas/schemas');

//load Auth variables
var configAuth = require('./auth');

module.exports = function (passport) {

	//serialize user for the session
	passport.serializeUser( function (user, done) {
		done(null, user.id);
	});

	//deserialize user
	passport.deserializeUser( function (id, done) {
		User.findById(id, function (err, user) {
			done(err, user);
		})
	});

	//facebook
	passport.use(new FacebookStrategy( {

		clientID : configAuth.facebookAuth.clientID,
		clientSecret : configAuth.facebookAuth.clientSecret,
		callbackURL : configAuth.facebookAuth.callbackURL
	},

	function (token, refreshToken, profile, done) {

		//async
		process.nextTick( function () {
			User.findOne({ 'facebook.id' : profile.id }, function (err, user) {

				if (err) 
					return done(err);

				if (user) {
					return done(null, user);
				} else {
					var newUser = new User();

					// set user information based on what facebook provides
					newUser.facebook.id = profile.id;
					newUser.facebook.token = token;
					newUser.facebook.name = profile.name.givenName + 
					' ' profile.name.lastName;
					newUser.facebook.email = profile.emails[0].value;

					newUser.save( function (err) {
						if (err) {
							throw err;

						return done(null, newUser);
						}
					});

				}
			});
		});
	}));
};