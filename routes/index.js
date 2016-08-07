var express = require('express');
var router = express.Router();
var request = require('request');
/* GET home page. */
router.get('/', function(req, res, next) {
	res.render('index', { title: 'Express' });
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

module.exports = router;
