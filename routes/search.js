/*globals require, process, module*/
var express = require('express');
var router = express.Router();


const yelp = require('yelp-fusion');
var yelpToken;

router.post('/', function(req, res, next) {
  var location = req.body.location;
  var yelpResults;
  //I have to call the accessToken function only when necessary
  yelp.accessToken(process.env.YELP_ID, process.env.YELP_SECRET).then(response => {
    const client = yelp.client(response.jsonBody.access_token);

    client.search({
      location: location,
      categories: 'apartments,condominiums'
    }).then(response => {
      yelpResults = response.jsonBody.businesses;
      
      res.send(yelpResults);
    });
  }).catch(e => {
    console.log(e);
  });
});

module.exports = router;