var User = require('../models/user');
var login = require('./login');
var signup = require('./signup');

exports = module.exports = function(passport){
	passport.serializeUser(function(user, done){
		//console.log('Serializing user :', user);
		done(null, user._id);
	});
	passport.deserializeUser(function(id, done){
		//console.log('Start deserialize');
		User.findById(id, function(err, user){
			//console.log('Deserializing user: ', user);
			done(err, user);
		});
	});
	passport.use('login', login);
	passport.use('signup', signup);
}