var express = require('express');
var router = express.Router();
var request = require('request');
/* GET home page. */
router.get('/', function(req, res, next) {
	res.render('index', { title: 'Home' , user: (req.user ? {username: req.user.username} : null)});
});
router.get('/request', function(req, res){
	var url = 'https://www.googleapis.com/books/v1/volumes?q=pattern%20reconigtion%20and%20machine%20learning';
	request(url, function(err, response, body){
		if (err) throw err;
		if (response.statusCode == 200){
			res.send(JSON.parse(body));
		}
	});
});

router.get('/mybooks', function(req, res){
	res.render('mybooks', { title: 'My books' , user: (req.user ? {username: req.user.username} : null)});
})

router.get('/incoming', function(req, res){
	res.render('incoming', { title: 'Incoming trade' , user: (req.user ? {username: req.user.username} : null)})
})

router.get('/outcoming', function(req, res){
	res.render('outcoming', { title: 'Outcoming trade' , user: (req.user ? {username: req.user.username} : null)});
})
module.exports = router;
