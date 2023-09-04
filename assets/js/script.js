var searchButton = $('#search-button');
var errorMsg = $('#error');

var currentDateDisplay = $("#current-day");
var currentTimeDisplay = $('#current-time');
var currentWeatherDisplay = $('#current-weather');

var cards = $('.cards');

var weatherLink = "https://api.openweathermap.org/data/2.5/daily?q=";
var key = "&appid=7cd6cced0b36f44c52ae06a0e7f9848c&units=imperial";

var city;
var currentCity = localStorage.getItem("currentCity");

var date = dayjs();

$(errorMsg).text("");

displayWeather();

function handleSearch(event)
{
    event.preventDefault();
    let cityInput = $('#city-search').val();
    
    city = cityInput;
    let requestURL = weatherLink + city + key;

    fetch(requestURL)
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
        localStorage.setItem(data.city.name, JSON.stringify(data));
        localStorage.setItem("currentCity", data.city.name);
        currentCity = localStorage.getItem("currentCity");
        displayWeather();
    })
}

function displayWeather()
{
    if (currentCity == null)
    {
        $(currentDateDisplay).text(date.format("MM/DD/YYYY"));
        $(currentTimeDisplay).text(date.format("h:mm a"));
    }

    else
    {
        let cityData = JSON.parse(localStorage.getItem(currentCity));

        $(currentDateDisplay).text(cityData.city.name + " " + date.format("MM/DD/YYYY"));
        $(currentTimeDisplay).text(date.format("h:mm a"));

        $(currentWeatherDisplay).children('#temp').text
        ("TEMP: " + cityData.list[2].main.temp + " °F");

        $(currentWeatherDisplay).children('#wind').text
        ("WIND: " + cityData.list[2].wind.speed + " MPH");

        $(currentWeatherDisplay).children('#humidity').text
        ("HUMIDITY: " + cityData.list[2].main.humidity + " %");

        displayForecast(cityData);
    }
}

function displayForecast(cityData)
{
    console.log(cityData);
    for (let i = 0; i < cards.children().length; i++)
    {
        let currentCard = cards.children().eq(i);
        let forecastDate = dayjs().add(i + 1, 'day');

        currentCard.children().children().eq(0).text
        (forecastDate.format("MM/DD/YY"));

        currentCard.children().children().eq(1).text
        ("TEMP: " + cityData.list[i].main.temp);
    }
}


searchButton.on('click', handleSearch);
