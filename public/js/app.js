// var app = new Vue({
//   el: '#app',
//   data: {
//     message: 'Hello Vue!'
//   }
// });

var navWidget = new Vue({
  el: '#navDiv',
  data: {
    address: '',
    location: 'Gainesville, FL'
  },
  methods: {
    updateWeather: function(){
      axios.get(`/location/${this.address}`)
            .then(function(response){
              console.log('location object:');
              console.log(response.data);
              navWidget.lat = response.data.results[0].geometry.location.lat;
              navWidget.lon = response.data.results[0].geometry.location.lng;
              navWidget.location = response.data.results[0].formatted_address;

              currentlyWidget.getWeather(navWidget.lat,navWidget.lon);
              dailyWidget.getDailyWeather(navWidget.lat,navWidget.lon);
              hourlyWidget.getHourlyWeather(navWidget.lat,navWidget.lon);
              minutelyWidget.getMinutelyWeather(navWidget.lat,navWidget.lon);

              // currentlyWidget.location = response.data.
            })
            .catch(function(err){
              console.log(err);
            });
    }
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
    address: '',
    location: 'Gainesville, FL',
    lat: 10,
    lon: -10,
  },
  methods: {
    // getLatLon: function(){
    // },
    iconUrl: function(iconString){
      return `/images/${iconString}.jpg`;
    },
    getWeather: function(lat, lon){
      var url = `/weather/${lat},${lon}`;
      axios.get(url)
            .then(function(response){
              console.log(response.data);
              currentlyWidget.time = response.data.currently.time;
              currentlyWidget.summary = response.data.currently.summary;
              currentlyWidget.icon = response.data.currently.icon;
              currentlyWidget.apparentTemperature = response.data.currently.apparentTemperature;
              currentlyWidget.precipProbability = response.data.currently.precipProbability;
              currentlyWidget.humidity = response.data.currently.humidity;
            })//if i want to use this inside a function, then put .bind(this) at the end of the .then function
            .catch(function(err){
              console.log(err);
            });
    },
    getDate: function(seconds){
      var date = new Date(seconds * 1000);
      var month = date.getMonth();
      var year = date.getFullYear();
      var day = date.getDate();
      var hour = date.getHours();
      var minutes = date.getMinutes();
      //return `${month + 1}/${day}/${year} ${hour}:${minutes < 9 ? '0' + minutes : minutes}`;
      var monthNames = [
        "January", "February", "March",
        "April", "May", "June", "July",
        "August", "September", "October",
        "November", "December"
      ];
      return monthNames[month] + ' ' + day  + ', ' + year;
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
    // dailyIcon: 'dailyIcon',
    days: [],
    latitude: 29.1,
    longitude: -81.4,
    location: 'gainesville',
    time: ''
  },
  methods: {
    // dailyIconUrl: function(iconString){
    //   return `/images/${iconString}.png`;
    // },
    getDailyWeather: function(lat, lon){
      var url = `/weather/${lat},${lon}`;
      axios.get(url)
            .then(function(response){
              dailyWidget.dailySummary = response.data.daily.summary;
              // dailyWidget.dailyIcon = response.data.daily.icon;
              dailyWidget.days = response.data.daily.data;
              dailyWidget.time = response.data.daily.data.time;
            })
            .catch(function(err){
              console.log(err);
            })
    },
    getDate: function(seconds){
      var date = new Date(seconds * 1000);
      var dayIndex = date.getDay();
      var weekday = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
      var date = new Date(seconds * 1000);
      var month = date.getMonth();
      var year = date.getFullYear();
      var day = date.getDate();
      return `${weekday[dayIndex]} ${month + 1}/${day}/${year}`;
      return ;
    },
  },
  created: function(){
    this.getDailyWeather(29.1, -81.4);
  }
});

var hourlyWidget = new Vue({
  el: '#hourly',
  data: {
    summary: "it's going rain!",
    icon: 'clear-night',
    hours: [],
    latitude: 29.1,
    longitude: -81.4,
  },
  methods: {
    // getMainIcon: function(){
    //   return `/images/${this.icon}.png`;
    // },
    getIcon: function(iconString){
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
              var tableX = [];
              var tableY = [];
              for (i = 0; i < hourlyData.data.length; i+=1){
                tableX.push(hourlyWidget.getDate(hourlyData.data[i].time));
              }
              for (i = 0; i < hourlyData.data.length; i+=1){
                tableY.push(hourlyData.data[i].apparentTemperature);
              }
              var chart = {
                x: tableX,
                y: tableY,
                type: 'scatter'
              };
              var data = [chart];
              var layout = {
                title: 'Hourly Temperature',
                xaxis: {
                  title: 'Time',
                },
                yaxis: {
                  title: 'Temperature (&deg;F)',
                },
                margin: {
                  b: 180
                }
              };
              Plotly.newPlot('myDiv', data, layout);

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

var minutelyWidget = new Vue({
  el: '#minutely',
  data: {
    summary: "it's going rain!",
    icon: 'clear-night',
    minutes: [],
    latitude: 29.1,
    longitude: -81.4
  },
  methods: {
    // getMainIcon: function(){
    //   return `/images/${this.icon}.png`;
    // },
    getIcon: function(iconString){
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
    },
    getMinutelyWeather: function(lat, lon){
      var url = `/weather/${lat},${lon}`;
      axios.get(url)
            .then(function(response){
              var minutelyData = response.data.minutely;
              this.summary = minutelyData.summary;
              this.icon = minutelyData.icon;
              this.minutes = minutelyData.data;
              var tableX = [];
              var tableY_precipIntensity = [];
              var tableY_precipProbability = [];
              for (i = 0; i < minutelyData.data.length; i+=1){
                tableX.push(minutelyWidget.getDate(minutelyData.data[i].time));
              }
              for (i = 0; i < minutelyData.data.length; i+=1){
                tableY_precipIntensity.push(minutelyData.data[i].precipIntensity);
              }
              for (i = 0; i < minutelyData.data.length; i+=1){
                tableY_precipProbability.push(minutelyData.data[i].precipProbability);
              }
              var chart1 = {
                x: tableX,
                y: tableY_precipIntensity,
                type: 'scatter',
                name: 'Intensity',
                mode: 'markers',
                marker: { size: 12 }
              };
              var chart2 = {
                x: tableX,
                y: tableY_precipProbability,
                type: 'scatter',
                name: 'Probability',
                mode: 'markers',
                marker: { size: 12 }
              };
              var layout = {
                xaxis: {
                  title: 'Time'
                },
                yaxis: {
                  range: [0, 1]
                },
                margin: {
                  b: 180
                },
                title:'Minutely Precipitation'
              };
              var data = [chart1, chart2];
              Plotly.newPlot('myMinutelyDiv', data, layout);
            }.bind(this))
            .catch(function(errors){
              console.log(errors);
            });
    }
  },
  created: function(){
    this.getMinutelyWeather(29.1, -81.4);
  }
});
