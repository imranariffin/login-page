var path = require('path');


var callbackURL = path.join('http://imranariffin-login-pag.elasticbeanstalk.com', '/auth/facebook/callback');

module.exports = {
	'facebookAuth' : {
		'clientID' : '1620888751493470',
		'clientSecret' : 'f376d18b026e5bb842062f86cde484ab',
		// 'callbackURL' : callbackURL,
		// 'callbackURL' : 'http://localhost:3000/auth/facebook/callback'
		'callbackURL' : 'http://localhost:8081/auth/facebook/callback'
	}
};