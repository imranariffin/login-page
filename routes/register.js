var express = require('express');
var router = express.Router();

// mongodDB setup
var mongoose = require('mongoose');
var Schema = require('../schemas/schemas.js');
var User = Schema.User;

//encryption setup
var bcrypt = require('bcryptjs');

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('register', { title: 'Auth - register' });
});

router.post('/', function (req, res) {
	//hash encrypt
	var hash = bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10));
	//create new document from req
	var user = new User({
		id : req.body.id,
		firstName : req.body.firstName,
		lastName : req.body.lastName,
		email : req.body.email,
		password : hash
	});
	//save if no oredy on db
	user.save( function (err) {
		if (err) {
			var err = "Something bad happened. Try again!";
			if (err.code === 11000) {
				err = "Email oredy taken";
			}
			res.send("Error: " + err);	
		} else {
			console.log("Save success");
			res.redirect('/dashboard');
		}
		res.end();
	})
});

module.exports = router;
