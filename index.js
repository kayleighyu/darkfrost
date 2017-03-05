var express = require('express');
var server = express();
var port = process.env.PORT || 8080;

//apiKey
var googleApiKey = require('./secrets').GeocodeAPIKey;

var darkskyApiKey = require('./secrets').darkskyAPIKey;
//axios
var axios = require('axios');

server.use(express.static(__dirname + '/public')); //serves up our html, css, js files in the public folder

server.get('/', function(request, response){
  response.sendFile('index.html', {root: __dirname + '/public/html'}); //so you don't have to navigate to the public folder, it will go straight to the website like kayleigh.com
});

server.get('/location/:address', function(request, response){
  var url = `https://maps.googleapis.com/maps/api/geocode/json?address=${request.params.address}&key=${googleApiKey}`;
  axios.get(url)
        .then(function(results){
          response.send(results.data);
        })
        .catch(function(err){
          response.send(err);
        });
});

server.get('/weather/:lat,:lon', function(request, response){
  var url = `https://api.darksky.net/forecast/${darkskyApiKey}/${request.params.lat},${request.params.lon}`;
  axios.get(url)
      .then(function(results){
        response.send(results.data);
      })
      .catch(function(err){
        response.send(err);
      });
});
server.listen(port, function(){
  console.log('Now listening on port...', port);
});
