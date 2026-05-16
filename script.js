// API CONFIG

const weatherApi = {

    key: "6a08177016f04e7dafc0f183",

    forecastUrl:
        "https://api.tomorrow.io/v4/weather/forecast"

};

// Input Box

let searchInputBox =
    document.getElementById("input-box");

// Enter Key

searchInputBox.addEventListener("keypress", (event) => {

    if (event.key === "Enter") {

        getWeather(searchInputBox.value);

    }

});

// Get Weather

function getWeather(city) {

    // Get Coordinates from GeoDB API

    fetch(`https://geodb-free-service.wirefreethought.com/v1/geo/cities?namePrefix=${city}&limit=1`)
        .then(response => response.json())
        .then(locationData => {

            console.log(locationData);

            if (
                !locationData.data ||
                locationData.data.length === 0
            ) {

                swal("Error", "City not found", "error");

                return;
            }

            // Coordinates

            let lat =
                locationData.data[0].latitude;

            let lon =
                locationData.data[0].longitude;

            // City Name

            let cityName =
                locationData.data[0].city;

            // Weather API

            fetch(`${weatherApi.forecastUrl}?location=${lat},${lon}&apikey=${weatherApi.key}`)
                .then(response => response.json())
                .then(weatherData => {

                    console.log(weatherData);

                    showWeather(
                        weatherData,
                        cityName
                    );

                });

        })

        .catch(error => {

            console.log(error);

            swal(
                "Error",
                "Something went wrong",
                "error"
            );

        });

}

// Show Weather

function showWeather(data, cityName) {

    let weatherBody =
        document.getElementById("weather-body");

    weatherBody.style.display = "block";

    // Current Weather

    let current =
        data.timelines.minutely[0].values;

    // Daily Forecast

    let daily =
        data.timelines.daily;

    // Date

    let todayDate = new Date();

    weatherBody.innerHTML = `

    <div class="location-deatils">

        <div class="city">

            ${cityName}

        </div>

        <div class="date">

            ${todayDate.toDateString()}

        </div>

    </div>

    <div class="weather-status">

        <div class="temp">

            ${Math.round(current.temperature)}°C

        </div>

        <div class="weather">

            Humidity ${current.humidity}%

        </div>

        <div class="min-max">

            Wind ${current.windSpeed} KM/H

        </div>

    </div>

    <hr>

    <div class="day-details">

        <div class="basic">

            Pressure ${current.pressureSurfaceLevel} mb <br>

            Visibility ${current.visibility} KM

        </div>

    </div>

    <hr>

    <div class="forecast">

        <h2>5-Day Forecast</h2>

        <div id="forecast-container"></div>

    </div>
    `;

    showForecast(daily);

    changeBg(current.weatherCode);

    reset();

}

// Forecast

function showForecast(dailyData) {

    let forecastContainer =
        document.getElementById(
            "forecast-container"
        );

    forecastContainer.innerHTML = "";

    dailyData.slice(0, 5).forEach(day => {

        let date = new Date(day.time);

        let forecastCard = `

        <div class="forecast-card">

            <h3>

                ${date.toLocaleDateString(
                    'en-US',
                    {
                        weekday: 'short'
                    }
                )}

            </h3>

            <p>

                🌡 Max ${Math.round(
                    day.values.temperatureMax
                )}°C

            </p>

            <p>

                ❄ Min ${Math.round(
                    day.values.temperatureMin
                )}°C

            </p>

            <p>

                🌧 Rain ${day.values.precipitationProbability}%

            </p>

        </div>
        `;

        forecastContainer.innerHTML +=
            forecastCard;

    });

}

// Background Change

function changeBg(code) {

    // Clear

    if (code === 1000) {

        document.body.style.backgroundImage =
            "url('clear.jpg')";
    }

    // Cloudy

    else if (
        code === 1001 ||
        code === 1100 ||
        code === 1101 ||
        code === 1102
    ) {

        document.body.style.backgroundImage =
            "url('clouds.jpg')";
    }

    // Rain

    else if (
        code >= 4000 &&
        code < 5000
    ) {

        document.body.style.backgroundImage =
            "url('rainy.jpg')";
    }

    // Snow

    else if (
        code >= 5000 &&
        code < 7000
    ) {

        document.body.style.backgroundImage =
            "url('snow.jpg')";
    }

    // Default

    else {

        document.body.style.backgroundImage =
            "url('bg1.jpg')";
    }

}

// Reset Input

function reset() {

    document.getElementById(
        "input-box"
    ).value = "";

}
