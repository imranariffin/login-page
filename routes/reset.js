// reset function 

var router = require('express').Router();

//mongoDB setup
var mongoose = require('mongoose');
var Schema = require('../schemas/schemas.js');
var User = Schema.User;

//setup encryption
var bcrypt = require('bcryptjs');

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

			var dbPassword = user.password;
			var reqPassword = req.body.password;

			// var hashOldDb = bcrypt.hashSync(user.password, bcrypt.genSaltSync(10));
			var hashOldReq = bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10));
			console.log('hashOldDb: ' + dbPassword);
			console.log('hashOldReq: ' + hashOldReq);

			if (bcrypt.compareSync(reqPassword, dbPassword)) {
				console.log('good : old password match');
				//change password
				var new_password = req.body.new_password;
				var hashNewPassword = bcrypt.hashSync(new_password, bcrypt.genSaltSync(10));
				console.log('changing password from ' + 
					user.password + ' to ' +
					new_password + " with hash value: " +
					hashNewPassword
					);
				user.password = hashNewPassword;
				// user._v.$inc();
				user.save();
			} else {
				console.log('bad: password does not match');
			}

			res.send('DONE TEST: resetting password: FROM ' + 
				dbPassword + " to " +
			    user.password);
		}
	});
});

module.exports = router;