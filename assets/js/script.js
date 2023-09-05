//Variable declarations
var searchButton = $('#search-button');
var errorMsg = $('#error');
var recentSearchList = $('#recent-searches');

var currentDateDisplay = $("#current-day");
var currentTimeDisplay = $('#current-time');
var currentWeatherDisplay = $('#current-weather');
var currentIcon = $('#current-icon');

var cards = $('.cards');

//Variables for API
var currentWeatherLink = "https://api.openweathermap.org/data/2.5/weather?q=";
var forecastWeatherLink = "http://api.openweathermap.org/data/2.5/forecast?q=";
var key = "&appid=7cd6cced0b36f44c52ae06a0e7f9848c&units=imperial";

//Get current time and assign it to a variable
var date = dayjs();

//Empty array to keep track of searches
var recentSearches;

//Gets the last searched city from local storage
var currentCity = localStorage.getItem("Current-City")

//Clears error message on load
$(errorMsg).text("");

getData();
getRecentSearches();

//Gets data from API and calls display functions
function getData()
{
    //If no city has been searched, just display the time and date
    if (currentCity == null)
    {
        $(currentDateDisplay).text(date.format("MM/DD/YYYY"));
        $(currentTimeDisplay).text(date.format("h:mm a"));
    }

    //If a city has been searched, get data and display weather
    else
    {
        //API for current weather
        let requestCurrent = currentWeatherLink + currentCity + key;
        //API for forecast weather
        let requestForecast = forecastWeatherLink + currentCity + key;

        fetch(requestCurrent)
        .then(function (response) {
            if (response.ok)
            {
                //Clear error message if data returns
                $(errorMsg).text("");
                return response.json();
            }
            else if (response.status === 404)
            {
                //Show error if no data returns
                $(errorMsg).text("City not found");
            }
        })
        .then(function (data) {
            //Clear text from search bar
            $('#city-search').val('');
            //Pass current weather data to display
            displayCurrentWeather(data);
        })

        fetch(requestForecast)
        .then(function (response) {
            if (response.ok)
            {
                //Clear error message if data returns
                $(errorMsg).text("");
                return response.json();
            }
            else if (response.status === 404)
            {
                //Show error if no data returns
                $(errorMsg).text("City not found");
            }
        })
        .then(function (data) {
            //Pass forecast weather data to display
            displayForecastWeather(data);
        })
    }
}

//Runs when search button clicked
function handleSearch(e)
{
    //Prevents refresh
    e.preventDefault();

    //Sets variable to the value of the search box
    let cityInput = $('#city-search').val();
    
    //Render error message if no text is in the field
    if (cityInput.length == 0)
    {
        $(errorMsg).text("City not found");
    }

    else
    {
        //Remove error message
        $(errorMsg).text("");
        
        currentCity = cityInput;

        //Sets the last city searched to local storage
        localStorage.setItem("Current-City", currentCity);
        //gets data for new city and displays weather
        getData();

        //If the city has not been searched yet, add it to the recent search list
        if (!recentSearches.includes(currentCity.toUpperCase()))
        {
            recentSearches.push(currentCity.toUpperCase());
            localStorage.setItem("recent-searches", JSON.stringify(recentSearches));
            addToList();
        }
    }
    
}

function displayCurrentWeather(data)
{
    //Renders date and time with the city name
    $(currentDateDisplay).text(data.name + date.format(" MM/DD/YYYY"));
    $(currentTimeDisplay).text(date.format("h:mm a"));

    //Renders icon for current weather
    let icon = data.weather[0].icon;
    $(currentIcon).attr('src', "https://openweathermap.org/img/w/" + icon + ".png");
    $(currentIcon).attr('style', 'display: block;');

    //Renders current temp
    $(currentWeatherDisplay).children('#temp').text
    ("TEMP: " + data.main.temp + " °F");
    
    //Renders current wind speed
    $(currentWeatherDisplay).children('#wind').text
    ("WIND: " + data.wind.speed + " MPH");
    
    //Renders current humidity
    $(currentWeatherDisplay).children('#humidity').text
    ("HUMIDITY: " + data.main.humidity + " %");
}

function displayForecastWeather(data)
{
    //Displays weather data for next 5 days
    for (let i = 0; i < cards.children().length; i++)
    {
        //Gets current card
        let currentCard = cards.children().eq(i);
        //Sets date on each card
        let forecastDate = dayjs().add(i + 1, 'day');

        currentCard.children().children().eq(0).text
        (forecastDate.format("MM/DD/YY"));

        //Index is multiped by 8 and then 5 is added to it. This gets the index 24 hours from the current time
        //EX: (0 * 8) + 5 = 5, (1 * 8) + 5 = 13
        //Index 5 is 24 hours from current time, index 13 is 48 hours from current time

        //Renders icon for each day
        let icon = data.list[(i * 8) + 5].weather[0].icon;
        currentCard.children().children().eq(1).attr
        ('src', "https://openweathermap.org/img/w/" + icon + ".png");
        currentCard.children().children().eq(1).attr
        ('style', 'display: block;');

        //Renders temp for each day
        currentCard.children().children().eq(2).text
        ("TEMP: " + data.list[(i * 8) + 5].main.temp + "°F");

        //Renders wind speed for each day
        currentCard.children().children().eq(3).text
        ("WIND: " + data.list[(i * 8) + 5].wind.speed + " MPH");

        //Renders humidity for each day
        currentCard.children().children().eq(4).text
        ("HUMIDITY: " + data.list[(i * 8) + 5].main.humidity + "%");
    }
}

//Gets list of cities previously searched and appends search button for each one
function getRecentSearches()
{
    //If the list is populated with a least one city
    if (JSON.parse(localStorage.getItem("recent-searches")) !== null)
    {
        recentSearches = JSON.parse(localStorage.getItem("recent-searches"));

        //Create button for each city in list
        for (let i = 0; i < recentSearches.length; i++)
        {
            //Creates button with an id of the cities name
            let button = recentSearchList.append
            ("<li><button id='" + recentSearches[i] + "'" + ">" + recentSearches[i] + "</button></li>");

            //Add listener to button, function changes current city and updates weather results for that city
            button.on('click', function(e) {
                currentCity = e.target.id;
        
                localStorage.setItem("Current-City", currentCity);
                getData();
            })
        }
    }
    
    //If no previous searches, declare empty array
    else
    {
        recentSearches = [];
    }
}

//When a new city is searched
function addToList()
{
    //Gets latest city in array
    let lastSearch = recentSearches.slice(-1);

    //Appends button with an id of the cities name
    let button = recentSearchList.append
    ("<li><button id='" + lastSearch + "'" + ">" + lastSearch + "</button></li>");

    //Adds listener to each button, sets current city to id of the button and refreshes weather data
    button.on('click', function(e) {
        currentCity = e.target.id;

        localStorage.setItem("Current-City", currentCity);
        getData();
    })
}

//Event listener for search button
searchButton.on('click', handleSearch);