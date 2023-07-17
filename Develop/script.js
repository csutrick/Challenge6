var searchButton = document.getElementById('search-button');
var cityInput = document.getElementById('userInput');
var pastSearchContainer = document.getElementById('container-pastSearch')
var cityInputTerm = document.getElementById('header-locationDate');
var currentDayContainer = document.getElementById('container-currentTemp');
var fiveDayContainer = document.getElementById('fiveDay-content');

searchTerms = [];

// Handles the user search
var inputHandler = function (event) {
    event.preventDefault();

    var city = cityInput.value.trim();

    if (city) {
        getApi(city);

        } else {
        alert('Please enter a valid city');
    }
};
// API function
var getApi = function(city) {
    // URL
    var requestUrl = 'http://api.openweathermap.org/data/2.5/forecast?q=' + city + ',usa&units=imperial&cnt=6&APPID=adf18ae524fd38390fa6667d35153b0c';
    // Fetch
    fetch(requestUrl)
        .then(function (response) {
            if (response.ok) {
                console.log('city found')
                response.json().then(function (data) {
                    addStorage(city);
                    displayWeather(data, city);
                });
            } else {
                console.log('not a city')
                alert('Error: ' + response.statusText);
            }
        })
        .catch(function (error) {
            alert('Unable to connect to weather service');
        });
};
// Appending content to the page
var displayWeather = function(data, searchTerm) {
    // Resets containers
    currentDayContainer.innerHTML = '';
    fiveDayContainer.innerHTML = '';
    for (var i = 0; i < data.list.length; i++) {
        
        // Converting the date/time
        const timestamp = data.list[i].dt;
        const date = new Date(timestamp * 1000);
        const formattedDate = `(${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()})`;

        // Other data about the day
        var temperature = 'Temperature: ' + data.list[i].main.temp + '°F';
        var wind = 'Wind Speed: ' + data.list[i].wind.speed + ' MPH';
        var humid = 'Humidity: ' + data.list[i].main.humidity;
        // If checks what day it is
        if (i === 0){
            var locationEl = document.createElement('span');
            locationEl.classList = 'header-locationDate';
            locationEl.textContent = searchTerm + formattedDate;

            var tempEl = document.createElement('span');
            tempEl.classList = 'header-temp';
            tempEl.textContent = temperature;

            var windEl = document.createElement('span');
            windEl.classList = 'header-wind';
            windEl.textContent = wind;

            var humidEl = document.createElement('span');
            humidEl.classList = 'header-humid';
            humidEl.textContent = humid;

            currentDayContainer.appendChild(locationEl);
            currentDayContainer.appendChild(tempEl);
            currentDayContainer.appendChild(windEl);
            currentDayContainer.appendChild(humidEl);
        } else {
            var fiveDayCard = document.createElement('div')
            fiveDayCard.classList = 'fiveDay-card';
            
            var dateEl = document.createElement('span');
            dateEl.classList = 'header-date';
            dateEl.textContent = formattedDate;

            var tempEl = document.createElement('span');
            tempEl.classList = 'header-temp';
            tempEl.textContent = temperature;

            var windEl = document.createElement('span');
            windEl.classList = 'header-wind';
            windEl.textContent = wind;

            var humidEl = document.createElement('span');
            humidEl.classList = 'header-humid';
            humidEl.textContent = humid;

            fiveDayCard.appendChild(dateEl);
            fiveDayCard.appendChild(tempEl);
            fiveDayCard.appendChild(windEl);
            fiveDayCard.appendChild(humidEl);
            fiveDayContainer.appendChild(fiveDayCard);
        };
    };
};
// Does or doesnt add the city to local storage
var addStorage = function(searchTerm) {
    console.log('Checking local storage');
    if(localStorage.getItem('searchTerms')) {
      searchTerms = JSON.parse(localStorage.getItem('searchTerms'));
    }

    // Convert term to lowercase before checking if it exists
    searchTerm = searchTerm.toLowerCase();

    if(!searchTerms.includes(searchTerm)){
      searchTerms.push(searchTerm);
      localStorage.setItem('searchTerms', JSON.stringify(searchTerms));
      addButton(searchTerm);
    }
}
// Adds the past search buttons
var addButton = function(searchTerm) {
    var pastSearchEl = document.createElement('button');
    pastSearchEl.classList = 'pastSearch';
    pastSearchEl.textContent = searchTerm;
    pastSearchContainer.appendChild(pastSearchEl);
};
// Loads local Storage when page loads or refresh
function displaySearchTerms() {
    if(localStorage.getItem('searchTerms')) {
      searchTerms = JSON.parse(localStorage.getItem('searchTerms'));
    }
  
    for(let i = 0; i < searchTerms.length; i++) {
      addButton(searchTerms[i]);
    }
};



// First thing to happen
displaySearchTerms()

// Event listener for search button
searchButton.addEventListener('click', inputHandler);
// Event listener for past searches
document.addEventListener('click', function(event) {
    if(event.target.classList.contains('pastSearch')) {
        console.log(event.target.textContent + ' button clicked');
        document.getElementById('userInput').value = event.target.textContent;
        getApi( event.target.textContent)
    }
});