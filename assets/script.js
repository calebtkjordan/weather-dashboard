function updateHistoryUI(history) {
    var historyEl = $('#history');
    historyEl.empty(); 

    // Loop through the history array and create a button for each city
    history.forEach(function(city) {
        var cityButton = $('<button>')
            .text(city)
            .addClass('history-item btn btn-secondary m-1 search-area') 
            .click(function() {
                fetchWeatherData(city); 
                fetchWeatherForecast(city)
            });

        historyEl.append(cityButton);
    });
}

function fetchWeatherData(cityName) {

    $('#today').empty();
    var apiKey = "234932dd2efa45aa9eb5e8b61a92165f";
    var apiUrl = "https://api.openweathermap.org/data/2.5/weather?q=" + cityName + "&appid=" + apiKey;

    $.get(apiUrl, function(response) {
        // Extracting data from response
        var cityName = response.name;
        var temperature = response.main.temp;
        var temperatureInCelsius = parseFloat((temperature - 273.15).toFixed(2));
        var weatherCondition = response.weather[0].main;
        var weatherIcon = response.weather[0].icon;
        var humidity = response.main.humidity;
        var windSpeed = response.wind.speed;
        var currentDate = dayjs().format('DD-MM-YYYY');
        var currentDateFormatted = "(" + dayjs().format('DD/MM/YYYY') + ")";

        console.log(currentDateFormatted)

        // Create elements for displaying data
        var cityNameEl = $('<h2>').text("Current Weather in " + cityName + " " + currentDateFormatted);
        var temperatureEl = $('<p>').text("Temperature: " + temperatureInCelsius + " °C");
        var conditionEl = $('<p>').text("Weather Conditions: " + weatherCondition);
        var humidityEl = $('<p>').text("Humidity: " + humidity + "%");
        var windSpeedEl = $('<p>').text("Wind Speed: " + windSpeed + " m/s");
        var weatherIconEl = $('<img>').attr("src", "https://openweathermap.org/img/wn/" + weatherIcon + "@2x.png");

        // Clear existing content and append new elements
        $('#today').empty().append(cityNameEl, temperatureEl, conditionEl, humidityEl, windSpeedEl, weatherIconEl);
    });
}

function fetchWeatherForecast(cityName) {

    $('#forecast').empty();
    var apiKey = "234932dd2efa45aa9eb5e8b61a92165f";
    var apiForecastUrl = "https://api.openweathermap.org/data/2.5/forecast?q=" + cityName + "&appid=" + apiKey;

    $.get(apiForecastUrl, function(forecastResponse){
        var forecastList = forecastResponse.list;
        var forecastCityName = forecastResponse.city.name;

        for (var i = 0; i < forecastList.length; i += 8) {
            var forecastItem = forecastList[i];

            var forecastDate = forecastItem.dt_txt;
            var forecastDate = new Date(forecastItem.dt_txt);
            var formattedDate = forecastDate.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });
            var forecastTemperature = forecastItem.main.temp;
            var forecastTemperatureInCelsius = parseFloat((forecastTemperature - 273.15).toFixed(2));
            var forecastHumidity = forecastItem.main.humidity;
            var forecastIcon = forecastItem.weather[0].icon;

            // Create a new div for each set of forecast data
            var forecastDiv = $('<div>').addClass('forecast-box');

            // Create elements for displaying data
            var forecastTitle = $('<h3>').text("5 Day Forecast for " + forecastCityName);
            var forecastDateEl = $('<p>').text(formattedDate);
            var forecastTemperatureEl = $('<p>').text("Temperature: " + forecastTemperatureInCelsius + " °C");
            var forecastHumidityEl = $('<p>').text("Humidity: " + forecastHumidity + "%");
            var forecastWeatherIconEl = $('<img>').attr("src", "https://openweathermap.org/img/wn/" + forecastIcon + ".png");

            // Append these elements to the new div
            forecastDiv.append(forecastDateEl, forecastTemperatureEl, forecastHumidityEl, forecastWeatherIconEl);

            // Append the new div to the #forecast section
            $('#forecast').append(forecastDiv);
        }
    })
}

$('#search-form').submit(function(event) {
    event.preventDefault();
    var cityInput = $('#search-input').val();
    fetchWeatherData(cityInput);
    fetchWeatherForecast(cityInput);

    // Retrieve current history or initialize an empty array
    var history = JSON.parse(localStorage.getItem('searchHistory')) || [];
    if (!history.includes(cityInput)) {
        history.push(cityInput);
        localStorage.setItem('searchHistory', JSON.stringify(history));
    }

    // Update the buttons on the page
    updateHistoryUI(history);

    $('#search-input').val(''); 
});

var historyUpdate = JSON.parse(localStorage.getItem('searchHistory')) || [];
updateHistoryUI(historyUpdate);