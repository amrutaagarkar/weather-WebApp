// Weather API

const weatherApi = {
    key: "df7dcacdc4ca9073762c2b558f681943",
    baseUrl: "https://api.openweathermap.org/data/2.5/weather",
    forecastUrl: "https://api.openweathermap.org/data/2.5/forecast"
};
// Input Box

let searchInputBox = document.getElementById("input-box");

searchInputBox.addEventListener("keypress", (event) => {

    if (event.key === "Enter") {
        getWeatherReport(searchInputBox.value);
    }

});

// Get Weather

function getWeatherReport(city) {

    // Current Weather

    fetch(`${weatherApi.baseUrl}?q=${city}&appid=${weatherApi.key}&units=metric`)
        .then(response => response.json())
        .then(weather => {

            if (weather.cod != 200) {

                swal("Error", "City not found", "error");
                return;
            }

            showWeatherReport(weather);

            // Forecast API

            fetch(`${weatherApi.forecastUrl}?q=${city}&appid=${weatherApi.key}&units=metric`)
                .then(response => response.json())
                .then(data => {
                    showForecast(data);
                });

        });

}

// Show Current Weather

function showWeatherReport(weather) {

    let weather_body = document.getElementById("weather-body");

    weather_body.style.display = "block";

    let todayDate = new Date();

    weather_body.innerHTML = `

    <div class="location-deatils">

        <div class="city">
            ${weather.name}, ${weather.sys.country}
        </div>

        <div class="date">
            ${dateManage(todayDate)}
        </div>

    </div>

    <div class="weather-status">

        <div class="temp">
            ${Math.round(weather.main.temp)}&deg;C
        </div>

        <div class="weather">
            ${weather.weather[0].main}
            <i class="${getIconClass(weather.weather[0].main)}"></i>
        </div>

        <div class="min-max">
            ${Math.floor(weather.main.temp_min)}°C (min) /
            ${Math.ceil(weather.main.temp_max)}°C (max)
        </div>

        <div>
            Updated as of ${getTime(todayDate)}
        </div>

    </div>

    <hr>

    <div class="day-details">

        <div class="basic">

            Feels like ${weather.main.feels_like}°C |
            Humidity ${weather.main.humidity}% <br>

            Pressure ${weather.main.pressure} mb |
            Wind ${weather.wind.speed} KM/H

        </div>

    </div>

    <hr>

    <div class="forecast">

        <h2>5-Day Forecast</h2>

        <div id="forecast-container"></div>

    </div>
    `;

    changeBg(weather.weather[0].main);

    reset();

}

// Show Forecast

function showForecast(data) {

    let forecastContainer = document.getElementById("forecast-container");

    if (!forecastContainer) return;

    forecastContainer.innerHTML = "";

    let dailyData = data.list.filter(item =>
        item.dt_txt.includes("12:00:00")
    );

    dailyData.forEach(day => {

        let date = new Date(day.dt_txt);

        let forecastCard = `

        <div class="forecast-card">

            <h3>
                ${date.toLocaleDateString('en-US', { weekday: 'short' })}
            </h3>

            <i class="${getIconClass(day.weather[0].main)}"></i>

            <p>${Math.round(day.main.temp)}°C</p>

            <p>${day.weather[0].main}</p>

        </div>
        `;

        forecastContainer.innerHTML += forecastCard;

    });

}

// Date Function

function dateManage(dateArg) {

    let days = [
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday"
    ];

    let months = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December"
    ];

    let day = days[dateArg.getDay()];
    let date = dateArg.getDate();
    let month = months[dateArg.getMonth()];
    let year = dateArg.getFullYear();

    return `${date} ${month} (${day}), ${year}`;
}

// Time Function

function getTime(todayDate) {

    let hour = addZero(todayDate.getHours());
    let minute = addZero(todayDate.getMinutes());

    return `${hour}:${minute}`;
}

// Add Zero

function addZero(i) {

    if (i < 10) {
        i = "0" + i;
    }

    return i;
}

// Reset Input

function reset() {

    document.getElementById("input-box").value = "";

}

// Background Change

function changeBg(status) {

    if (status === "Clouds") {
        document.body.style.backgroundImage = "url('img/clouds.jpg')";
    }

    else if (status === "Rain") {
        document.body.style.backgroundImage = "url('img/rainy.jpg')";
    }

    else if (status === "Clear") {
        document.body.style.backgroundImage = "url('img/clear.jpg')";
    }

    else if (status === "Snow") {
        document.body.style.backgroundImage = "url('img/snow.jpg')";
    }

    else {
        document.body.style.backgroundImage = "url('img/bg1.jpg')";
    }

}

// Icons

function getIconClass(weatherType) {

    if (weatherType === "Rain") {
        return "fas fa-cloud-showers-heavy";
    }

    else if (weatherType === "Clouds") {
        return "fas fa-cloud";
    }

    else if (weatherType === "Clear") {
        return "fas fa-sun";
    }

    else if (weatherType === "Snow") {
        return "fas fa-snowflake";
    }

    else {
        return "fas fa-cloud-sun";
    }

}
