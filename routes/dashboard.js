var express = require('express');
var router = express.Router();

//get session from login
var login = require('./login');

//setup mongo
var mongoose = require('mongoose');
var Schemas = require('../schemas/schemas.js');
var User = Schemas.User;

/* GET home page. */
router.get('/', function(req, res, next) {
	if (req.session && req.session.user) {
		User.findOne({ email : req.session.user.email }, function (err, user) {
			if (!user) {
				req.session.reset();
				res.redirect('/login');
			} else {
				res.locals.user = user;
				res.render('dashboard.hjs', { title : 'Dashboard'});
			}
		});
	} else {
		res.redirect('/login');
	}
});

module.exports = router;
