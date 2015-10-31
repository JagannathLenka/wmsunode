var express = require('express');
var config  = require('../config/config.js')

var router = express.Router();


var request = require('request');

  /* GET home page. */
  router.get('/', function(req, res, next) {

    token = req.headers['authorization']

    client = req.query.client
    warehouse = req.query.warehouse

    request(config.serviceUrl() +  '/configuration?client='+ client + '&warehouse=' + warehouse + '&authorization=' + token, function (error, response, body) {
    if (!error && response.statusCode == 200) { 
      res.json(JSON.parse(body));
    }
  })

});

router.get('/:id', function(req, res, next) {
  
  //client = req.query.client
  //warehouse = req.query.warehouse
  token = req.headers['authorization']

  request(config.serviceUrl() + '/configuration/' +  req.params.id + '?authorization=' + token, function (error, response, body) {
    console.log('I am here');
    if (!error && response.statusCode == 200) { 
      res.json(JSON.parse(body));
    }
  })
});



module.exports = router;