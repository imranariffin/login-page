var path = require('path');


var callbackURL = path.join(__dirname, '/auth/facebook/callback');

module.exports = {
	'facebookAuth' : {
		'clientID' : '1620888751493470',
		'clientSecret' : 'f376d18b026e5bb842062f86cde484ab',
		'callbackURL' : callbackURL
	}
};