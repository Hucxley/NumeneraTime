GamesList = new Mongo.Collection('savedGames');
WeatherStates = new Mongo.Collection('weatherStates'); // https://erikflowers.github.io/weather-icons/


if (Meteor.isClient) {
  // counter starts at 0

  var timeDep = new Deps.Dependency(); // !!!
  var timeValue;
  var timeInterval;

  var counter = 0;
  var isActive = false;
  var intervalModifier;
  var timeNow;
  var years, months, days, hours, minutes, seconds;
  var pmFlag;
  var seed;
  var currentTime;
  var displayTime;

  var numeneraTimeLib = {
    addRound: function(n) {

      counter += (n * 6);
      timeDisplay = timeNow + counter;
      displayTime = numeneraTimeLib.convertToDisplay(timeDisplay);
      numeneraTimeLib.update(displayTime);

    },

    addTime: function(n) {
      if (n) {
        counter += n;
        timeDisplay = timeNow + counter;
        displayTime = numeneraTimeLib.convertToDisplay(timeDisplay);
        numeneraTimeLib.update(displayTime);
      } else {
        if (pmFlag) {
          while (pmFlag) {
            counter += 1000;
            timeDisplay = timeNow + counter;
            displayTime = numeneraTimeLib.convertToDisplay(timeDisplay);
            numeneraTimeLib.update(displayTime);
          }
          numeneraTimeLib.pauseCounter();
        } else {
          while (!pmFlag) {
            counter += 1000;
            timeDisplay = timeNow + counter;
            displayTime = numeneraTimeLib.convertToDisplay(timeDisplay);
            numeneraTimeLib.update(displayTime);
          }
          numeneraTimeLib.pauseCounter();
        }
      }


    },

    start: function() {
      clearInterval(intervalHandler);
      if (!isActive) {
        isActive = true;
      }
      intervalHandler = Meteor.setInterval(
        numeneraTimeLib.count,
        intervalModifier);

    },

    count: function() {

      if (isActive) {

        counter++;
        timeDisplay = timeNow + counter;
        displayTime = numeneraTimeLib.convertToDisplay(timeDisplay);
        numeneraTimeLib.update(displayTime);

      }

    },

    convertToDisplay: function(timeNow) {
      years = Math.floor(timeNow / (313 * 28 * 60 * 60)) + 1;
      var yearSecsRemaining = Math.floor(timeNow % (313 * 28 * 60 * 60)) +
        1;
      months = Math.floor(yearSecsRemaining / (26 * 28 * 60 * 60)) + 1;
      var monthSecsRemaining = Math.floor(yearSecsRemaining % (26 * 28 * 60 *
        60)) + 1;
      days = Math.floor(monthSecsRemaining / (28 * 60 * 60)) + 1;
      var daySecsRemaining = Math.floor(monthSecsRemaining % (28 * 60 * 60)) +
        1;
      hours = Math.floor(daySecsRemaining / (60 * 60));
      var hourSecsRemaining = Math.floor(daySecsRemaining % (60 * 60));
      minutes = Math.floor(hourSecsRemaining / (60));
      var minuteSecsRemaining = Math.floor(hourSecsRemaining % (60));
      seconds = minuteSecsRemaining;
      currentTime = {
        "years": years,
        "months": months,
        "days": days,
        "hours": hours,
        "minutes": minutes,
        "seconds": seconds
      };
      timeValue = months + "/" + days + "/" + years + "  " + hours + ":" +
        minutes + ":" + seconds;


      return currentTime;


    },

    pauseCounter: function() {

      isActive = false;
      clearInterval(intervalHandler);
      intervalModifier = 1000;
    },

    initAttributes: function(n) {
      seed = 0;
      timeNow = numeneraTimeLib.timeConstruct(n);
      intervalModifier = 1000;
      pmFlag = false;
      intervalHandler = Meteor.setInterval(
        numeneraTimeLib.count,
        intervalModifier);
      return timeNow;

    },

    timeConstruct: function(seed) {
      if (seed) {
        seconds = seed;
      } else {
        seconds = Math.floor((Math.random() * 900000000000) + 1);
      };
      console.log("init secs: " + seconds);
      return seconds;
    },

    travelTime: function() {
      if (intervalModifier === 1) {
        intervalModifier = 1000;
        console.log(intervalModifier);
        numeneraTimeLib.start();
      } else {
        intervalModifier = 1;
        console.log(intervalModifier);
        numeneraTimeLib.start();
      }

    },
    update: function(currentTime) {
      numeneraTimeLib.backgroundImageChanger(
        currentTime.months,
        currentTime.days,
        currentTime.hours,
        currentTime.minutes);
      timeDep.changed();
    },

    backgroundImageChanger: function(month, day, hour, minute) {
      var clearNightImgUrl =
        'public/Screen-Shot-2014-10-20-at-7.29.52-PM.png';
      var clearDayImgUrl =
        'public/clouds-colorful-colourful-1029.jpg';
      var starryNightImgUrl =
        'public/1409058910637_wps_9_PIC_BY_MATT_PAYNE_CATERS.jpg';
      var stormyDayImgUrl =
        'public/pct-section-k-83-granite-chief-wilderness.jpg';
      if (hour >= 22 || hour < 4) {
        pmFlag = true;
        console.log("image shift to night");
        $('body').css('background-image',
          'url(public/Screen-Shot-2014-10-20-at-7.29.52-PM.png) no-repeat center center cover;'
        );
      } else {
        pmFlag = false;
        console.log('image shift to day');
        $('body').css('background-image',
          'url(public/clouds-colorful-colourful-1029.jpg) no-repeat center center cover;'
        );
      }
    },
    newGame: function() {
      if (typeof(intervalHandler) !== 'undefined') {
        clearInterval(intervalHandler);
      }
      timeNow = numeneraTimeLib.initAttributes();
      displayTime = numeneraTimeLib.convertToDisplay(timeNow);
      numeneraTimeLib.update(displayTime);
      return timeNow;
    },
  };

  Template.clock.created = function() {
    timeNow = numeneraTimeLib.initAttributes();
    displayTime = numeneraTimeLib.convertToDisplay(timeNow);
  };

  Template.clock.helpers({
    time: function() {
      timeDep.depend();
      return timeValue;
    }
  });

  Template.clock.destroyed = function() {
    Meteor.clearInterval(intervalHandler);
  };


  Template.weather.helpers({
    weather: function() {
      //do stuff with weather.
    }
  });

  Template.navigation.helpers({
    fetchSavedGameTime: function() {
      var currentUserId = Meteor.userId();
      var searchResult = GamesList.find({
        createdBy: currentUserId
      }, {
        fields: {
          gameTime: 1
        }
      });
      return searchResult;

    }

  });

  Template.navigation.events({
    'click .new-game': function() {
      var gameID = uuid.tiny();
      var currentUserId = Meteor.userId();
      timeNow = numeneraTimeLib.newGame();
      GamesList.insert({
        gameId: gameID,
        gameTime: timeNow,
        createdBy: currentUserId,
        currentWeather: 'night-sleet',
        joinedPlayers: []
      })
    },
    'click .toggle-travel-time': function() {
      console.log("You toggled travel time");
      // increment the counter when button is clicked
      if (intervalModifier === 1) {
        intervalModifier = 1000;
        console.log(intervalModifier);
        numeneraTimeLib.start();
      } else {
        intervalModifier = 1;
        console.log(intervalModifier);
        numeneraTimeLib.start();
      }
    },
    'click .start-clock': function() {
      console.log("You clicked the start button");
      numeneraTimeLib.start();
    },
    'click .pause-clock': function() {
      numeneraTimeLib.pauseCounter();
    },
    'click .travel-half-day': function(e) {
      numeneraTimeLib.addTime(14 * 60 * 60);
      numeneraTimeLib.start();
      e.preventDefault(); // prevent the default anchor functionality
    },

    'click .travel-one-day': function(e) {
      numeneraTimeLib.addTime(28 * 60 * 60);
      numeneraTimeLib.start();
      e.preventDefault(); // prevent the default anchor functionality
    },

    'click .pass-the-time': function(e) {
      numeneraTimeLib.addTime();
      numeneraTimeLib.start();
      e.preventDefault(); // prevent the default anchor functionality
    },
    'click .add-combat-round': function(n) {
      counter += (n * 6);
      timeDisplay = timeNow + counter;
      displayTime = numeneraTimeLib.convertToDisplay(timeDisplay);
      numeneraTimeLib.update(displayTime);

    },
    'click .save-game-time': function() {
      console.log("You clicked to save game.")
        // Write seed time to mongo Games Collection
      var currentUserId = Meteor.getId();
      GamesList.update({
        _id: GameID,
        createdBy: currentUserId
      }, {
        gameTime: timeDisplay
      });
    },
    'click .resume-game-state': function() {
      //get seed value from Games Collection for this user;
      console.log("YOu clicked to resume a previous game.")
      seed = fetchSavedGameTime().gameTime;
      console.log(seed);
      console.log(seed.gameTime);
      //timeNow = initAttributes(seed);
      //console.log("seed set: " + timeNow);
      //displayTime = numeneraTimeLib.convertToDisplay(timeNow);
      //numeneraTimeLib.update(displayTime);
    }


  });
}

if (Meteor.isServer) {
  Meteor.startup(function() {
    // code to run on server at startup
  });
}
