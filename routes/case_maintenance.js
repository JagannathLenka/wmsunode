var express = require('express');
var config  = require('../config/config.js')

var router = express.Router();
var request = require('request');

  /* GET home page. */
  router.get('/', function(req, res, next) {

    token = req.headers['authorization']

    request(config.serviceUrl() +'/case?client=WM&warehouse=WH1&authorization=' + token, function (error, response, body) {
    if (!error && response.statusCode == 200) { 
      res.json(JSON.parse(body));
    }
  })

});

router.get('/:id', function(req, response, next) {
  
  request(config.serviceUrl() + '/case/' +  req.params.id + '/?client=WM&warehouse=WH1&authorization=' + token, function (error, response, body) {
    if (!error && response.statusCode == 200) { 
      res.json(JSON.parse(body));
    }
  })
});



module.exports = router;