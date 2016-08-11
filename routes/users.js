var express = require('express');
var router = express.Router();
var bcrypt = require('bcrypt-nodejs');

/* GET users listing. */
module.exports = function(passport){
	router.get('/', function(req, res, next) {
		res.send('respond with a resource');
	});
	router.post('/login', function(req, res){
		passport.authenticate('login', function(err, user, info){
			if (err) throw err;
			if (!user) {
				return res.json({errCode: -1, msg: 'Login Failed'});
			}
			req.logIn(user, function(err){
				if (err) throw err;
				return res.json({errCode: 0, msg: 'Login success'});
			});
		})(req, res);
	});
	router.get('/logout', function(req, res){
		if (req.isAuthenticated()) {
			req.logout();
		}
		res.json({errCode: 0, msg: 'OK'});
	});
	router.post('/signup', function(req, res){
		passport.authenticate('signup', function(err, user, info){
			if (err) throw err;
			if (!user) {
				return res.json({errCode: -2, msg: 'Username already exists'});
			}
			req.logIn(user, function(err){
				if (err) throw err;
				return res.json({errCode: 0, msg: 'Signup success'});
			});
		})(req, res);
	});
	router.get('/info', function(req, res){
		if (req.isAuthenticated()){
			res.json({errCode: 0, user: {
				id: req.user._id,
				username: req.user.username
			}});
		}
		else {
			res.json({errCode: -3, msg: 'Not login'});
		}
	});
	router.post('/changepassword', function(req, res){
		if (!req.isAuthenticated()) {
			return res.json({errCode: -3, msg: 'Not login'});
		}
		if (!req.body.password) {
			return res.json({errCode: -5, msg: 'Missing argument \'password\''});
		}
		if (!req.body.newPassword) {
			return res.json({errCode: -5, msg: 'Missing argument \'newPassword\''});
		}
		var password = req.body.password;
		var newPassword = req.body.newPassword;
		if (!bcrypt.compareSync(password, req.user.password)) {
			return res.json({errCode: -1, msg: 'Password mismatch'});
		}
		req.user.password = bcrypt.hashSync(newPassword);
		req.user.save();
		res.json({errCode: 0, msg: 'Password changed'});
	});
	return router;
}

