// Weather API

const weatherApi = {
    key: "df7dcacdc4ca9073762c2b558f681943",
    baseUrl: "https://api.openweathermap.org/data/2.5/weather",
    forecastUrl: "https://api.openweathermap.org/data/2.5/forecast"
};

// Search Input

let searchInputBox = document.getElementById("input-box");

// Enter Key Event

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

            console.log(weather);

            if (weather.cod != 200) {

                swal("Error", "City not found", "error");
                return;
            }

            showWeatherReport(weather);

        });

    // Forecast Weather

    fetch(`${weatherApi.forecastUrl}?q=${city}&appid=${weatherApi.key}&units=metric`)
        .then(response => response.json())
        .then(data => {

            console.log(data);

            showForecast(data);

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
            ${Math.round(weather.main.temp)}°C
        </div>

        <div class="weather">
            ${weather.weather[0].main}
            <i class="${getIconClass(weather.weather[0].main)}"></i>
        </div>

        <div class="min-max">
            ${Math.floor(weather.main.temp_min)}°C /
            ${Math.ceil(weather.main.temp_max)}°C
        </div>

    </div>

    <hr>

    <div class="day-details">

        <div class="basic">

            Feels like ${weather.main.feels_like}°C |
            Humidity ${weather.main.humidity}% <br>

            Wind ${weather.wind.speed} KM/H

        </div>

    </div>

    <hr>

    <div class="forecast">

        <h2>7-Day Forecast</h2>

        <div id="forecast-container"></div>

    </div>
    `;

    changeBg(weather.weather[0].main);

    reset();

}

// Show Forecast

function showForecast(data) {

    setTimeout(() => {

        let forecastContainer =
            document.getElementById("forecast-container");

        if (!forecastContainer) {

            console.log("Forecast container not found");

            return;
        }

        forecastContainer.innerHTML = "";

        let dailyForecast = [];

        // Get one forecast every 24 hours

        for (let i = 0; i < data.list.length; i += 8) {

            dailyForecast.push(data.list[i]);

        }

        // Make 7 cards

        while (dailyForecast.length < 7) {

            dailyForecast.push(
                dailyForecast[dailyForecast.length - 1]
            );

        }

        dailyForecast.slice(0, 7).forEach(day => {

            let date = new Date(day.dt_txt);

            let forecastCard = `

            <div class="forecast-card">

                <h3>
                    ${date.toLocaleDateString('en-US', {
                        weekday: 'short'
                    })}
                </h3>

                <i class="${getIconClass(day.weather[0].main)}"></i>

                <p>
                    ${Math.round(day.main.temp)}°C
                </p>

                <p>
                    ${day.weather[0].main}
                </p>

            </div>
            `;

            forecastContainer.innerHTML += forecastCard;

        });

    }, 500);

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

// Change Background

function changeBg(status) {

    if (status === "Clouds") {

        document.body.style.backgroundImage =
            "url('clouds.jpg')";
    }

    else if (status === "Rain") {

        document.body.style.backgroundImage =
            "url('rainy.jpg')";
    }

    else if (status === "Clear") {

        document.body.style.backgroundImage =
            "url('clear.jpg')";
    }

    else if (status === "Snow") {

        document.body.style.backgroundImage =
            "url('snow.jpg')";
    }

    else {

        document.body.style.backgroundImage =
            "url('bg1.jpg')";
    }

}

// Weather Icons

function getIconClass(weatherType) {

    if (weatherType === "Rain") {

        return "fas fa-cloud-rain";
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

    else if (weatherType === "Thunderstorm") {

        return "fas fa-bolt";
    }

    else if (
        weatherType === "Mist" ||
        weatherType === "Fog" ||
        weatherType === "Haze"
    ) {

        return "fas fa-smog";
    }

    else {

        return "fas fa-cloud-sun";
    }

}

// Reset Input

function reset() {

    document.getElementById("input-box").value = "";

}
