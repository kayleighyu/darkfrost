var express = require('express');
var server = express();
var port = process.env.PORT || 8080;

//apiKey
var apiKey = require('./secrets').darkskyAPIKey;
//axios
var axios = require('axios');

server.get('/weather/:lat,:lon', function(request, response){
  var url = `https://api.darksky.net/forecast/${apiKey}/${request.params.lat},${request.params.lon}`;
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
