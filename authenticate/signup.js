var bcrypt = require('bcrypt-nodejs');
var LocalStrategy = require('passport-local').Strategy;
var User = require('../models/user');

var signup = new LocalStrategy(function(username, password, done){
	process.nextTick(function(){
		User.findOne({'username': username}, function(err, user){
			if (err) {
				return done(err);
			}
			if (user) {
				console.log('User already exists');
				return done(null, false);
			}
			var newUser = new User();
			newUser.username = username;
			newUser.password = bcrypt.hashSync(password);
			newUser.save(function(err){
				if (err) throw err;
				console.log('Register success');
				return done(null, newUser);
			});
		});
	});
});

module.exports = signup;