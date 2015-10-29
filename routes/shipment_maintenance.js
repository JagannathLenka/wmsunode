var express = require('express');
var router = express.Router();

var http = require('http');

/* GET home page. */
router.get('/:id', function(req, response, next) {
  
  var optionsget = {
    host : 'wmsservice.herokuapp.com', // here only the domain name
    port : 3001,
    method : 'GET' // do GET
  };
 // do the GET request

    if (req.params.id != null) {
      optionsget.path = '/shipment/' + req.params.id + '?client=WM&warehouse=WH1'
    }
    else {
      optionsget.path =  '/shipment/?client=WM&warehouse=WH1' 
    }


  var reqGet = http.request(optionsget, function(res) {
    console.log("statusCode: ", res.statusCode);
 
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


/* GET home page. */
router.get('/', function(req, response, next) {
  
  var optionsget = {
    host : 'localhost', // here only the domain name
    port : 3001,
    path : '/shipment/?client=WM&warehouse=WH1', // the rest of the url with parameters if needed
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