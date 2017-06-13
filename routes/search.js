/*globals require, process, module*/
var express = require('express');
var router = express.Router();
var request = require('requestretry');
var xml2js = require('xml2js');

const yelp = require('yelp-fusion');
var parser = new xml2js.Parser({explicitArray: false, explicitRoot: false});
var yelpToken;

router.post('/', function(req, res, next) {
  var location = req.body.location;
  var yelpResults;
  //I have to call the accessToken function only when necessary
  yelp.accessToken(process.env.YELP_ID, process.env.YELP_SECRET)
    .then(response => {
    const client = yelp.client(response.jsonBody.access_token);

    client.search({
      location: location,
      categories: 'apartments,condominiums'
    }).then(response => {
      yelpResults = response.jsonBody.businesses;
      
      var promise = new Promise( function(resolve, reject) {
       resolve(yelpResults.filter(getDataFromZillow));
      });
      return promise;
    }).then(response => {
      console.log(response);
      res.send(response);
  });
  }).catch(e => {
    console.log(e);
  });
});

function shouldRetry(error, response, body) {
    parser.parseString(body, function(err, result) {
      if (err) {
        return true;
      }
      else{
        return false;
      }
    });
  }

function getDataFromZillow(element, index, array) {
  
  request.get({
      url: 'http://www.zillow.com/webservice/GetSearchResults.htm',
      qs: {
        'zws-id': process.env.ZILLOW_KEY,
        address: element.location.address1,
        citystatezip: element.location.zip_code
      },
      retryStrategy: shouldRetry
    }, function (error, zillowResponse, body) {
        if(error){
          return false;
        }
        
        parser.parseString(body, function (err, result) {
          if(err){
            return false;
          }

          if(!result.response){
            return false;
          }
          if(!result.response.results.result.length){
            element.unitsAvailable = 1;
          }
          else{
            element.unitsAvailable = result.response.results.result.length;
          }
          return true;
        });

    });
  
}

module.exports = router;