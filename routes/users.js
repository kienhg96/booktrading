var express = require('express');
var router = express.Router();

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
			res.json({errCode: 0, user: req.user});
		}
		else {
			res.json({errCode: -3, msg: 'Not login'});
		}
	});
	return router;
}

