var bcrypt = require('bcrypt-nodejs');
var LocalStrategy = require('passport-local').Strategy;
var User = require('../models/user');

var login = new LocalStrategy(function(username, password, done){
	User.findOne({'username': username}, function(err, user){
		if (err) {
			return done(err);
		}
		if (!user) {
			console.log('username not found');
			return done(null, false);
		}
		if (!bcrypt.compareSync(password, user.password)) {
			console.log('password mismatch');
			return done(null, false);
		}
		console.log('Login success');
		return done(null, user);
	})
});

module.exports = login;