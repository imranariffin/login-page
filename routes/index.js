var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', 
	requireLogin,
	function(req, res, next) {
		res.render('index', { title: 'Auth' });
});

module.exports = router;

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