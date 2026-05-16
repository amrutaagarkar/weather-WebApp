// Weather API Object
const weatherApi = {
    key: '4eb3703790b356562054106543b748b2',
    baseUrl: 'https://api.openweathermap.org/data/2.5/weather',
    forecastUrl: 'https://api.openweathermap.org/data/2.5/forecast'
};

// Search Input
let searchInputBox = document.getElementById('input-box');

searchInputBox.addEventListener('keypress', (event) => {
    if (event.keyCode == 13) {
        getWeatherReport(searchInputBox.value);
    }
});

// Current Weather Function
function getWeatherReport(city) {

    // Current Weather
    fetch(`${weatherApi.baseUrl}?q=${city}&appid=${weatherApi.key}&units=metric`)
        .then(weather => weather.json())
        .then(showWeatherReport);

    // Forecast Weather
    fetch(`${weatherApi.forecastUrl}?q=${city}&appid=${weatherApi.key}&units=metric`)
        .then(response => response.json())
        .then(showForecast);
}

// Show Current Weather
function showWeatherReport(weather) {

    let city_code = weather.cod;

    if (city_code === '400') {
        swal("Empty Input", "Please enter any city", "error");
        reset();
    }
    else if (city_code === '404') {
        swal("Bad Input", "Entered city didn't match", "warning");
        reset();
    }
    else {

        let op = document.getElementById('weather-body');
        op.style.display = 'block';

        let todayDate = new Date();

        let weather_body = document.getElementById('weather-body');

        weather_body.innerHTML = `

        <div class="location-deatils">
            <div class="city">${weather.name}, ${weather.sys.country}</div>
            <div class="date">${dateManage(todayDate)}</div>
        </div>

        <div class="weather-status">
            <div class="temp">${Math.round(weather.main.temp)}&deg;C</div>

            <div class="weather">
                ${weather.weather[0].main}
                <i class="${getIconClass(weather.weather[0].main)}"></i>
            </div>

            <div class="min-max">
                ${Math.floor(weather.main.temp_min)}&deg;C (min) /
                ${Math.ceil(weather.main.temp_max)}&deg;C (max)
            </div>

            <div id="updated_on">
                Updated as of ${getTime(todayDate)}
            </div>
        </div>

        <hr>

        <div class="day-details">
            <div class="basic">
                Feels like ${weather.main.feels_like}&deg;C |
                Humidity ${weather.main.humidity}% <br>

                Pressure ${weather.main.pressure} mb |
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
}

// Show Forecast
function showForecast(data) {

    let forecastContainer = document.getElementById('forecast-container');

    if (!forecastContainer) {
        return;
    }

    forecastContainer.innerHTML = "";

    const dailyData = data.list.filter(item =>
        item.dt_txt.includes("12:00:00")
    );

    dailyData.slice(0, 5).forEach(day => {

        const date = new Date(day.dt_txt);

        const forecastCard = `
        <div class="forecast-card">

            <h3>${date.toDateString().split(' ')[0]}</h3>

            <p>${Math.round(day.main.temp)}°C</p>

            <p>${day.weather[0].main}</p>

            <i class="${getIconClass(day.weather[0].main)}"></i>

        </div>
        `;

        forecastContainer.innerHTML += forecastCard;
    });
}

// Time Function
function getTime(todayDate) {

    let hour = addZero(todayDate.getHours());
    let minute = addZero(todayDate.getMinutes());

    return `${hour}:${minute}`;
}

// Date Function
function dateManage(dateArg) {

    let days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

    let months = ['January', 'February', 'March', 'April',
        'May', 'June', 'July', 'August',
        'September', 'October', 'November', 'December'];

    let year = dateArg.getFullYear();
    let month = months[dateArg.getMonth()];
    let date = dateArg.getDate();
    let day = days[dateArg.getDay()];

    return `${date} ${month} (${day}), ${year}`;
}

// Background Change
function changeBg(status) {

    if (status === 'Clouds') {
        document.body.style.backgroundImage = 'url(img/clouds.jpg)';
    }
    else if (status === 'Rain') {
        document.body.style.backgroundImage = 'url(img/rainy.jpg)';
    }
    else if (status === 'Clear') {
        document.body.style.backgroundImage = 'url(img/clear.jpg)';
    }
    else {
        document.body.style.backgroundImage = 'url(img/bg.jpg)';
    }
}

// Weather Icons
function getIconClass(classarg) {

    if (classarg === 'Rain') {
        return 'fas fa-cloud-showers-heavy';
    }
    else if (classarg === 'Clouds') {
        return 'fas fa-cloud';
    }
    else if (classarg === 'Clear') {
        return 'fas fa-sun';
    }
    else if (classarg === 'Snow') {
        return 'fas fa-snowman';
    }
    else {
        return 'fas fa-cloud-sun';
    }
}

// Reset Input
function reset() {
    document.getElementById('input-box').value = "";
}

// Add Zero
function addZero(i) {

    if (i < 10) {
        i = "0" + i;
    }

    return i;
}
