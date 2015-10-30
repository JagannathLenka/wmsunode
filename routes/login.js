var express = require('express');
var config  = require('../config/config.js')
var router = express.Router();

var request = require('request');

/* GET home page. */
router.post('/', function(req, res, next) {


	userid = req.body.userid;
	client = req.body.client;
	password = req.body.password;


	user_details = {user_details: {client: client, user_id: userid, password: password}}

	request({url: config.serviceUrl() +'/authenticate/signin', form: user_details, method: 'POST'}, function(error,response,body){
    	if (!error ) { 
      		res.json(JSON.parse(body));
	    }	
	});

});

module.exports = router;
