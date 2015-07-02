var express = require('express');
var router = express.Router();
// var sessions = require('client-sessions');
//mongoDB setup
var mongoose = require('mongoose');
var Schema = require('../schemas/schemas.js');
var User = Schema.User;

//encryption setup
var bcrypt = require('bcryptjs');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('login', { title: 'Auth - login' });
});

router.post('/', function (req, res) {
	// get email from request
	var email = req.body.email;
	// email has to be all lowercase
	email = email.toLowerCase();
	// find user based on email --- email is unique
	User.findOne({email : email}, function (err, user) {
		//check if user exist
		if (user) {
			// check if password given is correct
			var inputPassword = req.body.password;
			var dbPassword = user.password;
			if ( bcrypt.compareSync(inputPassword, dbPassword)) {
				req.session.user = user;
				// res.redirect('/dashboard');
				res.redirect('/');
			} else {
				res.send('Error: wrong password for ' + user.email);
			}
		} else {
			res.send('Error: user does not exist');
		}
		res.send();
	});
});

module.exports = router;
