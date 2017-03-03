// var app = new Vue({
//   el: '#app',
//   data: {
//     message: 'Hello Vue!'
//   }
// });

var currentlyWidget = new Vue({
  el:'#currently',
  data:{
    time: 100000,
    summary: 'Partly cloudy',
    icon:'partly-cloudy',
    apparentTemperature: 77,
    precipProbability: 0.30,
    humidity: 0.61,
    location: 'Gainesville, FL',
    latitude: 29.1,
    longitude: -81.4
  },
  methods: {
    // getLatLon: function(){
    // },
    iconUrl: function(iconString){
      return `/images/${iconString}.png`;
    },
    getWeather: function(lat, lon){
      var url = `/weather/${lat},${lon}`;
      console.log(url);
      axios.get(url)
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
            })//if i want to use this inside a function, then put .bind(this) at the end of the .then function
            .catch(function(err){
              console.log(err);
            });
    },
    updateWeather: function(){
      this.getWeather(this.latitude, this.longitude);
    }
  },
  created: function(){
    this.getWeather(29.1, -81.4);
  }
});

var dailyWidget = new Vue({
  el: '#daily',
  data:{
    dailySummary: 'dailySummary',
    dailyIcon: 'dailyIcon',
  },
  methods: {
    dailyIconUrl: function(iconString){
      return `/images/${iconString}.png`;
    }
  },
  created: function(){
    axios.get('/weather/29.1,-81.4')
          .then(function(response){
            dailyWidget.dailySummary = response.data.daily.summary;
            dailyWidget.dailyIcon = response.data.daily.icon;
          })
          .catch(function(err){
            console.log(err);
          })
  }
});

var hourlyWidget = new Vue({
  el: '#hourly',
  data: {
    summary: "it's going rain!",
    icon: 'clear-night',
    hours: []
  },
  methods: {
    getMainIcon: function(){
      return `/images/${this.icon}.png`;
    },
    getHourlyIcon: function(iconString){
      return `/images/${iconString}.png`;
    },
    getDate: function(seconds){
      var date = new Date(seconds * 1000);
      var month = date.getMonth();
      var year = date.getFullYear();
      var day = date.getDate();
      var hour = date.getHours();
      var minutes = date.getMinutes();
      return `${month + 1}/${day}/${year} ${hour}:${minutes < 9 ? '0' + minutes : minutes}`;
      console.log(date);
    },
    getHourlyWeather: function(lat, lon){
      var url = `/weather/${lat},${lon}`;
      axios.get(url)
            .then(function(response){
              var hourlyData = response.data.hourly;
              console.log(hourlyData);
              this.summary = hourlyData.summary;
              this.icon = hourlyData.icon;
              this.hours = hourlyData.data;
            }.bind(this))
            .catch(function(errors){
              console.log(errors);
            });
    }
  },
  created: function(){
    this.getHourlyWeather(29.1, -81.4);
  }
});
