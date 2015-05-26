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
	User.findOne({email : req.body.email}, function (err, user) {
		//check if user exist
		if (user) {
			// check if password given is correct
			var inputPassword = req.body.password;
			var dbPassword = user.password;
			if ( bcrypt.compare(inputPassword, dbPassword)) {
				req.session.user = user;
				res.redirect('/dashboard');
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
