var counter = 0;
var isActive = false;
var intervalModifier;
var timeNow;
var years, months, days, hours, minutes, seconds;
var pmFlag;
var seed;
var currentTime;
var displayTime;

function addRound(n) {

    counter += (n * 6);
    timeDisplay = timeNow + counter;
    displayTime = convertToDisplay(timeDisplay);
    update(displayTime);

}

function addTime(n) {
    if (n) {
        counter += n;
        timeDisplay = timeNow + counter;
        displayTime = convertToDisplay(timeDisplay);
        update(displayTime);
    } else {
        if (pmFlag) {
            while (pmFlag) {
                counter += 1000;
                timeDisplay = timeNow + counter;
                displayTime = convertToDisplay(timeDisplay);
                update(displayTime);
            }
            pauseCounter();
        } else {
            while (!pmFlag) {
                counter += 1000;
                timeDisplay = timeNow + counter;
                displayTime = convertToDisplay(timeDisplay);
                update(displayTime);
            }
            pauseCounter();
        }
    }


}

function start()
{
    clearInterval(intervalHandler);
    if (!isActive) {
        isActive = true;
    }
    intervalHandler = setInterval("count()", intervalModifier);

}

function count(){

    if (isActive)
    {

        counter++;
        timeDisplay = timeNow + counter;
        console.log("counting: " + timeDisplay);
        console.log("interval: " + intervalModifier);
        displayTime = convertToDisplay(timeDisplay);
        update(displayTime);

    }

}

function convertToDisplay(timeNow) {
    years = Math.floor(timeNow / (313 * 28 * 60 * 60)) + 1 ;
    var yearSecsRemaining = Math.floor(timeNow % (313 * 28 * 60 * 60)) + 1;
    months = Math.floor(yearSecsRemaining / (26 * 28 * 60 * 60)) + 1;
    var monthSecsRemaining = Math.floor(yearSecsRemaining % (26 * 28 * 60 * 60)) + 1 ;
    days = Math.floor(monthSecsRemaining / (28 * 60 * 60)) + 1;
    var daySecsRemaining = Math.floor(monthSecsRemaining % (28 * 60 * 60)) +1 ;
    hours = Math.floor(daySecsRemaining / (60 * 60));
    var hourSecsRemaining = Math.floor(daySecsRemaining % (60 * 60));
    minutes = Math.floor(hourSecsRemaining / (60));
    var minuteSecsRemaining = Math.floor(hourSecsRemaining % (60));
    seconds = minuteSecsRemaining;
    currentTime = { "years": years, "months": months, "days": days, "hours": hours, "minutes": minutes, "seconds": seconds };


    return currentTime;


}

function pauseCounter() {

    isActive = false;
    clearInterval(intervalHandler);
    intervalModifier = 1000;
}

function initAttributes(n) {
    counter = 0;
    seed = 0;
    timeNow = timeConstruct(n);
    intervalModifier = 1000;
    pmFlag = false;
    intervalHandler = setInterval("count()", intervalModifier);
    return timeNow;

};

function timeConstruct(seed) {
    if (seed) {
        seconds = seed;
    } else {
        seconds = Math.floor((Math.random() * 900000000000) + 1);
    };
    console.log("init secs: " +seconds);
    return seconds;
}

function backgroundImageChanger(month, day, hour, minute) {
    var clearNightImgUrl = '../img/Screen-Shot-2014-10-20-at-7.29.52-PM.png';
    var clearDayImgUrl = '../img/clouds-colorful-colourful-1029[1].jpg';
    var starryNightImgUrl = '../img/1409058910637_wps_9_PIC_BY_MATT_PAYNE_CATERS_[1].jpg';
    var stormyDayImgUrl = '..img/pct-section-k-83-granite-chief-wilderness[1].jpg';
    if (hour >= 22 || hour < 4)
    {
        pmFlag = true;
        document.getElementById('main').style.backgroundImage = "url(" + clearNightImgUrl + ")";
    }
    else
    {
        pmFlag = false;
        document.getElementById('main').style.backgroundImage = "url(" + clearDayImgUrl + ")";
    }
}

function setSeed() {
    seed = parseInt(document.getElementById('time-seed').value);
    document.getElementById('importModal').toggle;
    timeNow = initAttributes(seed);
    console.log("seed set: " + timeNow);
    displayTime = convertToDisplay(timeNow);
    $('#divider1').show();
    $('#divider2').show();
    $('#divider3').show();
    $('#divider4').show();
    update(displayTime);
}

function newGame() {
    if (typeof(intervalHandler) !== 'undefined') {
        clearInterval(intervalHandler);
    }
    timeNow = initAttributes();
    displayTime = convertToDisplay(timeNow);
    $('#divider1').show();
    $('#divider2').show();
    $('#divider3').show();
    $('#divider4').show();
    update(displayTime);
}

function update(currentTime) {
    backgroundImageChanger(currentTime.months, currentTime.days, currentTime.hours, currentTime.minutes);
    $('#counter-months').text(currentTime.months);
    $('#counter-days').text(currentTime.days);
    $('#counter-years').text(currentTime.years);
    $('#counter-hours').text(currentTime.hours);
    $('#counter-minutes').text(currentTime.minutes);
    $('#counter-seconds').text(currentTime.seconds);

}

function getSeedTime() {
    $('#export-seed-display').text(timeDisplay);
}

function travelTime() {
    if (intervalModifier === 1) {
        intervalModifier = 1000;
        console.log(intervalModifier);
        start();
    } else {
        intervalModifier = 1;
        console.log(intervalModifier);
        start();
    }

}

$(document).ready(function () {
    $('#divider1').hide();
    $('#divider2').hide();
    $('#divider3').hide();
    $('#divider4').hide();
})

$('#travel-half-day').click(function (e) {
    addTime(14 * 60 * 60);
    e.preventDefault();// prevent the default anchor functionality
});

$('#travel-one-day').click(function (e) {
    addTime(28 * 60 * 60);
    e.preventDefault();// prevent the default anchor functionality
});

$('#pass-the-time').click(function (e) {
    addTime();
    e.preventDefault();// prevent the default anchor functionality
});
