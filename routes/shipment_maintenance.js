var express = require('express');
var router = express.Router();

var http = require('http');

/* GET home page. */
router.get('/', function(req, response, next) {
  
  var optionsget = {
    host : 'wmsservice.herokuapp.com', // here only the domain name
    //port : 3001,
    path :  '/shipment/?client=WM&warehouse=WH1',
    method : 'GET' // do GET
  };
 // do the GET request

  var reqGet = http.request(optionsget, function(res) {
    console.log("statusCode: ", res.statusCode);
 
 	var responseString = '';
    res.on('data', function(d) {
        responseString += d;	
    });
 
  res.on('end', function() {
      //console.log(responseString);
      var responseObject = JSON.parse(responseString);
      response.json(responseObject);
    });

  });
 
  reqGet.end();
  reqGet.on('error', function(e) {
    console.error(e);
  });

});

router.get('/:id', function(req, response, next) {
  
  console.log(req.params.id)

  var optionsget = {
    host : 'wmsservice.herokuapp.com', // here only the domain name
    //port : 3001,
    path :  '/shipment/'+ req.params.id + '?client=WM&warehouse=WH1',
    method : 'GET' // do GET
  };
 // do the GET request

  var reqGet = http.request(optionsget, function(res) {
    //console.log("statusCode: ", res.statusCode);
 
  var responseString = '';
    res.on('data', function(d) {
        responseString += d;  
    });
 
  res.on('end', function() {
      console.log(responseString);
      var responseObject = JSON.parse(responseString);
      response.json(responseObject);
    });

  });
 
  reqGet.end();
  reqGet.on('error', function(e) {
    console.error(e);
  });

});



module.exports = router;