//TODO:
//1. Fix button being added when bad city searched
//2. fix responsiveness of forecast

var searchButton = $('#search-button');
var errorMsg = $('#error');
var recentSearchList = $('#recent-searches');

var currentDateDisplay = $("#current-day");
var currentTimeDisplay = $('#current-time');
var currentWeatherDisplay = $('#current-weather');
var currentIcon = $('#current-icon');

var cards = $('.cards');

var currentWeatherLink = "https://api.openweathermap.org/data/2.5/weather?q=";
var forecastWeatherLink = "http://api.openweathermap.org/data/2.5/forecast?q=";
var key = "&appid=7cd6cced0b36f44c52ae06a0e7f9848c&units=imperial";

var date = dayjs();

var recentSearches;
var currentCity = localStorage.getItem("Current-City")

$(errorMsg).text("");

getData();
getRecentSearches();

function getData()
{
    if (currentCity == null)
    {
        $(currentDateDisplay).text(date.format("MM/DD/YYYY"));
        $(currentTimeDisplay).text(date.format("h:mm a"));
    }

    else
    {
        let requestCurrent = currentWeatherLink + currentCity + key;
        let requestForecast = forecastWeatherLink + currentCity + key;

        fetch(requestCurrent)
        .then(function (response) {
            if (response.ok)
            {
                $(errorMsg).text("");
                return response.json();
            }
            else if (response.status === 404)
            {
                $(errorMsg).text("City not found");
            }
        })
        .then(function (data) {
            $('#city-search').val('');
            displayCurrentWeather(data);
        })

        fetch(requestForecast)
        .then(function (response) {
            if (response.ok)
            {
                $(errorMsg).text("");
                return response.json();
            }
            else if (response.status === 404)
            {
                $(errorMsg).text("City not found");
            }
        })
        .then(function (data) {
            displayForecastWeather(data);
        })
    }
}

function handleSearch(e)
{
    e.preventDefault();

    let cityInput = $('#city-search').val();
    
    if (cityInput.length == 0)
    {
        $(errorMsg).text("City not found");
    }

    else
    {
        $(errorMsg).text("");
        
        currentCity = cityInput;

        localStorage.setItem("Current-City", currentCity);
        getData();

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
    $(currentDateDisplay).text(data.name + date.format(" MM/DD/YYYY"));
    $(currentTimeDisplay).text(date.format("h:mm a"));

    let icon = data.weather[0].icon;
    $(currentIcon).attr('src', "https://openweathermap.org/img/w/" + icon + ".png");
    $(currentIcon).attr('style', 'display: block;');

    $(currentWeatherDisplay).children('#temp').text
    ("TEMP: " + data.main.temp + " °F");

    $(currentWeatherDisplay).children('#wind').text
    ("WIND: " + data.wind.speed + " MPH");

    $(currentWeatherDisplay).children('#humidity').text
    ("HUMIDITY: " + data.main.humidity + " %");
}

function displayForecastWeather(data)
{
    for (let i = 0; i < cards.children().length; i++)
    {
        let currentCard = cards.children().eq(i);
        let forecastDate = dayjs().add(i + 1, 'day');

        currentCard.children().children().eq(0).text
        (forecastDate.format("MM/DD/YY"));

        let icon = data.list[(i * 8) + 5].weather[0].icon;
        currentCard.children().children().eq(1).attr
        ('src', "https://openweathermap.org/img/w/" + icon + ".png");
        currentCard.children().children().eq(1).attr
        ('style', 'display: block;');

        currentCard.children().children().eq(2).text
        ("TEMP: " + data.list[(i * 8) + 5].main.temp + "°F");

        currentCard.children().children().eq(3).text
        ("WIND: " + data.list[(i * 8) + 5].wind.speed + " MPH");

        currentCard.children().children().eq(4).text
        ("HUMIDITY: " + data.list[(i * 8) + 5].main.humidity + "%");
    }
}

function getRecentSearches()
{
    if (JSON.parse(localStorage.getItem("recent-searches")) !== null)
    {
        recentSearches = JSON.parse(localStorage.getItem("recent-searches"));

        for (let i = 0; i < recentSearches.length; i++)
        {
            let button = recentSearchList.append
            ("<li><button id='" + recentSearches[i] + "'" + ">" + recentSearches[i] + "</button></li>");

            button.on('click', function(e) {
                currentCity = e.target.id;
        
                localStorage.setItem("Current-City", currentCity);
                getData();
            })
        }
    }
    
    else
    {
        recentSearches = [];
    }
}

function addToList()
{
    let lastSearch = recentSearches.slice(-1);
    let button = recentSearchList.append
    ("<li><button id='" + lastSearch + "'" + ">" + lastSearch + "</button></li>");

    button.on('click', function(e) {
        currentCity = e.target.id;

        localStorage.setItem("Current-City", currentCity);
        getData();
    })
}

searchButton.on('click', handleSearch);