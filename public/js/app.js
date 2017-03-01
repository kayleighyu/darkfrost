var app = new Vue({
  el: '#app',
  data: {
    message: 'Hello Vue!'
  }
});

var currentlyWidget = new Vue({
  el:'#currently',
  data:{
    time: 100000,
    summary: 'Partly cloudy',
    icon:'partly-cloudy',
    apparentTemperature: 77,
    precipProbability: 0.30,
    humidity: 0.61,
    location: 'Gainesville, FL'
  },
  methods: {
    iconUrl: function(iconString){
      return `/images/${iconString}.png`;
    }
  },
  created: function(){
    axios.get('/weather/29.1,-81.4')
          .then(function(response){
            console.log(response.data);
            currentlyWidget.time = response.data.currently.time;
            currentlyWidget.summary = response.data.currently.summary;
            currentlyWidget.icon = response.data.currently.icon;
            currentlyWidget.apparentTemperature = response.data.currently.apparentTemperature;
            currentlyWidget.precipProbability = response.data.currently.precipProbability;
            currentlyWidget.humidity = response.data.currently.humidity;
            currentlyWidget.location = response.data.currently.location;
            console.log(this.time);
          })
          .catch(function(err){
            console.log(err);
          });
  }
});
