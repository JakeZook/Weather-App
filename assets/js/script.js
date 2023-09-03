var searchButton = $('#search-button');

var currentDateDisplay = $("#current-day");
var currentTimeDisplay = $('#current-time');

var weatherLink = "https://api.openweathermap.org/data/2.5/weather?q=";
var key = "&appid=7cd6cced0b36f44c52ae06a0e7f9848c";

var date = dayjs();

$(currentDateDisplay).text(date.format("DD/MM/YYYY"));
$(currentTimeDisplay).text(date.format("h:mm a"));

function handleSearch(event)
{
    event.preventDefault();
    let cityInput = $('#city-search').val();
    
    let city = cityInput;
    let requestURL = weatherLink + city + key;

    fetch(requestURL)
    .then(function (response) {
        return response.json();
    })
    .then(function (data) {
        console.log(data)
        $(currentDateDisplay).text(data.name + " " + date.format("DD/MM/YYYY"));

    })
}

searchButton.on('click', handleSearch);
