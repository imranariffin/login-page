var express = require('express');
var router = express.Router();

//get session from login
var login = require('./login');

//setup mongo
var mongoose = require('mongoose');
var Schemas = require('../schemas/schemas.js');
var User = Schemas.User;

/* GET home page. */
router.get('/', requireLogin, function(req, res, next) {
	console.log('test');
	res.render('dashboard.hjs', { title : 'Dashboard'}); 
});

//always check if user is logged in or not.
// if not redirect to login page
function requireLogin (req, res, next) {
	if (req.user) {
		next();
	} else {
		console.log('req.user is false');
		res.redirect('/login');
	}
}

module.exports = router;
