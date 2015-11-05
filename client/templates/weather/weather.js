//temporary random icon selector to test weather simulation matching from live APIs
var weatherCode = Math.floor(Math.random() * 26 + 1);
console.log("generated randomCode: " + weatherCode);

Template.weather.helpers({
  icon: function() {
    if(Meteor.userId()){
      var gameInfo = Session.get('gameInfo');
      weatherCode = gameInfo.currentWeather;
      console.log('randomWeather overwritten by saved weather state: ' +weatherCode);
    }
    Session.set('weatherCode', weatherCode.toString());
    return "wi wi-" + WeatherStates.findOne({
      code: weatherCode.toString()
    }, {
      icon: 1
    }).icon;
  }
})
