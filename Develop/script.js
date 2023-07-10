var searchButton = document.getElementById('search-button');
var cityInput = document.getElementById('userInput');
var fiveDayContainer = document.getElementById('fiveDay-content');
var cityInputTerm = document.getElementById('header-locationDate');

var inputHandler = function (event) {
    event.preventDefault();

    var city = cityInput.value.trim()

    if (city) {
        getApi(city);

        cityInput.value = '';
        fiveDayContainer.textContent = 'working';
        } else {
        alert('Please enter a valid city');
    }
};



var getApi = function(city) {
    var requestUrl = 'http://api.openweathermap.org/data/2.5/forecast?q=' + city + ',usa&units=imperial&cnt=6&APPID=adf18ae524fd38390fa6667d35153b0c';

    fetch(requestUrl)
        .then(function (response) {
            if (response.ok) {
            response.json().then(function (data) {
            displayWeather(data, city);
            });
            } else {
            alert('Error: ' + response.statusText);
            }
        })
        .catch(function (error) {
            alert('Unable to connect to weather service');
        });
};


var displayWeather = function(data, searchTerm) {
    console.log('getting data')

    cityInputTerm.textContent = searchTerm;

    for (var i = 0; i < data.list.length; i++) {
        var temperature = 'Temperature: ' + data.list[i].main.temp + '°F';
        var wind = 'Wind Speed: ' + data.list[i].wind.speed + ' MPH';
        var humid = 'Humidity: ' + data.list[i].main.humidity;

        console.log(temperature);
        console.log(wind);
        console.log(humid);
    };
};



searchButton.addEventListener('click', inputHandler);
