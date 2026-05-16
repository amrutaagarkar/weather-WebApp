// WeatherAPI.com

const weatherApi = {

    key: "8cd2f882afd3427383e171546261605",

    baseUrl:
        "https://api.weatherapi.com/v1/forecast.json"

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

    fetch(`${weatherApi.baseUrl}?key=${weatherApi.key}&q=${city}&days=7&aqi=no&alerts=no`)
        .then(response => response.json())
        .then(data => {

            console.log(data);

            // Error Handling

            if (data.error) {

                swal(
                    "Error",
                    data.error.message,
                    "error"
                );

                return;
            }

            showWeather(data);

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

function showWeather(data) {

    let weatherBody =
        document.getElementById("weather-body");

    weatherBody.style.display = "block";

    // Current Weather

    let current =
        data.current;

    // Location

    let location =
        data.location;

    // Forecast

    let forecast =
        data.forecast.forecastday;

    weatherBody.innerHTML = `

    <div class="location-deatils">

        <div class="city">

            ${location.name},
            ${location.country}

        </div>

        <div class="date">

            ${location.localtime}

        </div>

    </div>

    <div class="weather-status">

        <div class="temp">

            ${current.temp_c}°C

        </div>

        <div class="weather">

            ${current.condition.text}

            <img
                src="https:${current.condition.icon}"
                width="60"
            >

        </div>

        <div class="min-max">

            Feels Like
            ${current.feelslike_c}°C

        </div>

    </div>

    <hr>

    <div class="day-details">

        <div class="basic">

            Humidity
            ${current.humidity}% <br>

            Wind
            ${current.wind_kph} KM/H <br>

            Pressure
            ${current.pressure_mb} mb

        </div>

    </div>

    <hr>

    <div class="forecast">

        <h2>7-Day Forecast</h2>

        <div id="forecast-container"></div>

    </div>
    `;

    showForecast(forecast);

    changeBg(
        current.condition.text
    );

    reset();

}

// Show Forecast

function showForecast(forecastData) {

    let forecastContainer =
        document.getElementById(
            "forecast-container"
        );

    forecastContainer.innerHTML = "";

    forecastData.forEach(day => {

        let date =
            new Date(day.date);

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

            <img
                src="https:${day.day.condition.icon}"
                width="50"
            >

            <p>

                ${day.day.avgtemp_c}°C

            </p>

            <p>

                ${day.day.condition.text}

            </p>

        </div>
        `;

        forecastContainer.innerHTML +=
            forecastCard;

    });

}

// Change Background

function changeBg(status) {

    status =
        status.toLowerCase();

    // Clouds

    if (
        status.includes("cloud")
    ) {

        document.body.style.backgroundImage =
            "url('clouds.jpg')";
    }

    // Rain

    else if (
        status.includes("rain") ||
        status.includes("drizzle")
    ) {

        document.body.style.backgroundImage =
            "url('rainy.jpg')";
    }

    // Clear

    else if (
        status.includes("clear") ||
        status.includes("sun")
    ) {

        document.body.style.backgroundImage =
            "url('clear.jpg')";
    }

    // Snow

    else if (
        status.includes("snow")
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
