// reset function 

var router = require('express').Router();

//mongoDB setup
var mongoose = require('mongoose');
var Schema = require('../schemas/schemas.js');
var User = Schema.User;

//check email exist or not
//if email exists, check match password of not

//if correct, change password

router.get('/', function (req, res, next) {
	res.render('reset', { title : 'Auth - Reset Password'});
});

router.post('/', function (req, res) {
	User.findOne({email : req.body.email}, function (err, user) {
		if (!user) {
			res.send(err + '\nError: user undefined');
		} else {
			console.log('good: user is ' + user.email);

			if (req.body.password === user.password) {
				console.log('good : password match');
				//change password
				var new_password = req.body.new_password;
				console.log('changing password from ' + 
					user.password + ' to ' +
					new_password
					);
				user.password = new_password;
				// user._v.$inc();
				user.save();
			} else {
				console.log('bad: password does not match');
			}

			res.send('DONE TEST: resetting password: ' + user.password);
		}
	});
});

module.exports = router;