var express = require('express');
var router = express.Router();

var passport = require('passport');

//get session from login
var login = require('./login');

//setup mongo
var mongoose = require('mongoose');
var Schemas = require('../schemas/schemas.js');
var User = Schemas.User;

/* GET home page. */
router.get('/', requireLogin, function(req, res, next) {
	console.log('test');
	// console.log('req.user:');
	// console.log(req.user);

	// console.log('req.session:');
	// console.log(req.session);
	console.log('req:');
	console.log(req);

	passport.serializeUser(function (user, done) {
		console.log('in serializeUser: user:');
		console.log(user);

		done(null, user);
	});

	console.log(passport);

	res.send(req.user);

	// res.render('dashboard.hjs', { title : 'Dashboard'}); 
});

//always check if user is logged in or not.
// if not redirect to login page
function requireLogin (req, res, next) {
	if (req.user || req.isAuthenticated()) {
		next();
	} else {
		console.log('req.user is false');

		//TEST///
		// next();

		res.redirect('/login');
	}
}

module.exports = router;
