Games = new Mongo.Collection("storedGames");
Players = new Mongo.Collection("players");
WeatherStates = new Mongo.Collection('weatherStates'); // https://erikflowers.github.io/weather-icons/



if (Meteor.isClient) {
  // counter starts at 0
  Session.setDefault('timer', 0);
  var timer = new ReactiveTimer(1);
  timer.tick();
  console.log(timer);

  var isActive = false;
  var intervalModifier;
  var timeNow;
  var years, months, days, hours, minutes, seconds;
  var pmFlag;
  var seed;
  var currentTime;
  var displayTime;

  Template.clock.helpers({
    timer: function() {
      timer.tick();
      return Session.get('timer');
    }
  });

  Template.weather.helpers({
    weather: function() {
      //do stuff with weather.
    }
  })

  Template.clock.events({
    'click button': function() {
      // increment the counter when button is clicked
      Session.set('counter', Session.get('counter') + 1);
    }
  });

  Template.navigation.events({



  });
}

if (Meteor.isServer) {
  Meteor.startup(function() {
    // code to run on server at startup
  });
}
