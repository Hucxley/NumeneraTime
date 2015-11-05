//temporary random icon selector to test weather simulation matching from live APIs
var randomCode = Math.floor(Math.random() * 26 + 1);
console.log("generated randomCode: " + randomCode);

Template.weather.helpers({
  icon: function() {
    Session.set('weatherCode', randomCode.toString());
    return "wi wi-" + WeatherStates.findOne({
      code: randomCode.toString()
    }, {
      icon: 1
    }).icon;
  }
})
