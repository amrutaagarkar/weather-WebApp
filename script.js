const weatherApi = {

    key: "8cd2f882afd3427383e171546261605",

    baseUrl:
        "https://api.weatherapi.com/v1/forecast.json"
};

// Input

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

    let current =
        data.current;

    let location =
        data.location;

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
                width="60">

        </div>

        <div class="min-max">

            Feels Like
            ${current.feelslike_c}°C

        </div>

    </div>

    <hr><br>

    <div class="day-details">

        Humidity:
        ${current.humidity}% <br><br>

        Wind:
        ${current.wind_kph} KM/H <br><br>

        Pressure:
        ${current.pressure_mb} mb

    </div>

    <br><hr>

    <div class="forecast">

        <h2>7-Day Forecast</h2>

        <div id="forecast-container"></div>

    </div>
    `;

    showForecast(forecast);

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
                        weekday:'short'
                    }
                )}

            </h3>

            <img
                src="https:${day.day.condition.icon}"
                width="50">

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
