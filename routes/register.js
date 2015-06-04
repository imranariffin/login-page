var express = require('express');
var router = express.Router();
// mongodDB setup
var mongoose = require('mongoose');
var Schema = require('../schemas/schemas.js');
var User = Schema.User;
//encryption setup
var bcrypt = require('bcryptjs');
//string format setup
var capitalizeFirstLetter = require('../scripts/string-functions').capitalizeFirstLetter;

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('register', { title: 'Auth - register' });
});

router.post('/', formalizeUserName, function (req, res) {
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

// callback function
function formalizeUserName(req, res, next) {
	console.log('typeof(req.body.firstName): ' + typeof(req.body.firstName) );
	req.body.firstName = capitalizeFirstLetter(req.body.firstName);
	req.body.lastName = capitalizeFirstLetter(req.body.lastName);
	req.body.email = req.body.email.toLowerCase();

	next();
}
// helper function
// function capitalizeFirstLetter (inputString) {
// 	stringArr = inputString.split(' ');

// 	for (i in stringArr) {
// 		word = stringArr[i];
// 		word = word[0].toUpperCase() + word.slice(1, word.length);

// 		stringArr[i] = word;
// 	}

// 	// convert back to string
// 	outputString = '';
// 	for (i in stringArr) {
// 		// consider case of space overflow
// 		if (i===0)
// 			outputString = stringArr[i];
// 		else
// 			outputString += ' ' + stringArr[i];
// 	}

// 	//remove 'space' at outputString[0]
// 	outputString = outputString.slice(1, outputString.length);

// 	return outputString;
// }

module.exports = router;
