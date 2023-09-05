var searchButton = $('#search-button');
var errorMsg = $('#error');

var currentDateDisplay = $("#current-day");
var currentTimeDisplay = $('#current-time');
var currentWeatherDisplay = $('#current-weather');
var currentIcon = $('#current-icon');

var cards = $('.cards');

var currentWeatherLink = "https://api.openweathermap.org/data/2.5/weather?q=";
var forecastWeatherLink = "http://api.openweathermap.org/data/2.5/forecast?q=";
var key = "&appid=7cd6cced0b36f44c52ae06a0e7f9848c&units=imperial";

var date = dayjs();

var currentCity = localStorage.getItem("Current-City")

$(errorMsg).text("");

getData();

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
            console.log(data);

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
            console.log(data);

            displayForecastWeather(data);
        })
    }
}

function handleSearch(e)
{
    e.preventDefault();
    let cityInput = $('#city-search').val();
    
    currentCity = cityInput;
    localStorage.setItem("Current-City", currentCity);
    getData();
}

function displayCurrentWeather(data)
{
    $(currentDateDisplay).text(data.name + date.format(" MM/DD/YYYY"));
    $(currentTimeDisplay).text(date.format("h:mm a"));

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

        currentCard.children().children().eq(1).text
        ("TEMP: " + data.list[i * 8].main.temp + "°F");

        currentCard.children().children().eq(2).text
        ("WIND: " + data.list[i * 8].wind.speed + " MPH");

        currentCard.children().children().eq(3).text
        ("HUMIDITY: " + data.list[i * 8].main.humidity + "%");
    }
}

searchButton.on('click', handleSearch);