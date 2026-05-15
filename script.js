// Weather API

const weatherApi = {

    key: '4eb3703790b356562054106543b748b2',

    baseUrl: 'https://api.openweathermap.org/data/2.5/weather'
};

// Input Box

let searchInputBox = document.getElementById('input-box');

// Enter Key Event

searchInputBox.addEventListener('keydown', function(event){

    if(event.key === "Enter"){

        getWeatherReport(searchInputBox.value);

    }

});

// Get Weather Data

function getWeatherReport(city){

    fetch(`${weatherApi.baseUrl}?q=${city}&appid=${weatherApi.key}&units=metric`)

    .then(response => response.json())

    .then(showWeatherReport)

    .catch(error => {

        console.log(error);

        swal("Error", "Something went wrong!", "error");

    });

}

// Show Weather Report

function showWeatherReport(weather){

    let city_code = weather.cod;

    if(city_code == 400){

        swal("Empty Input", "Please enter city name", "error");

        reset();
    }

    else if(city_code == 404){

        swal("City Not Found", "Please enter correct city", "warning");

        reset();
    }

    else{

        let weather_body = document.getElementById('weather-body');

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

                <div id="updated_on">

                    Updated as of ${getTime(todayDate)}

                </div>

            </div>

            <hr>

            <div class="day-details">

                <div class="basic">

                    Feels like ${Math.round(weather.main.feels_like)}°C |

                    Humidity ${weather.main.humidity}%

                    <br>

                    Pressure ${weather.main.pressure} mb |

                    Wind ${weather.wind.speed} KM/H

                </div>

            </div>
        `;

        // Change Background

        changeBg(weather.weather[0].main);

        // Reset Input

        reset();
    }
}

// Time Function

function getTime(todayDate){

    let hour = addZero(todayDate.getHours());

    let minute = addZero(todayDate.getMinutes());

    return `${hour}:${minute}`;
}

// Date Function

function dateManage(dateArg){

    let days = [

        'Sunday',
        'Monday',
        'Tuesday',
        'Wednesday',
        'Thursday',
        'Friday',
        'Saturday'
    ];

    let months = [

        'January',
        'February',
        'March',
        'April',
        'May',
        'June',
        'July',
        'August',
        'September',
        'October',
        'November',
        'December'
    ];

    let year = dateArg.getFullYear();

    let month = months[dateArg.getMonth()];

    let date = dateArg.getDate();

    let day = days[dateArg.getDay()];

    return `${date} ${month} (${day}), ${year}`;
}

// Change Background

function changeBg(status){

    if(status === 'Clouds'){

        document.body.style.backgroundImage = "url('clouds.jpg')";
    }

    else if(status === 'Rain'){

        document.body.style.backgroundImage = "url('rain.jpg')";
    }

    else if(status === 'Clear'){

        document.body.style.backgroundImage = "url('clear.jpg')";
    }

    else if(status === 'Snow'){

        document.body.style.backgroundImage = "url('snow.jpg')";
    }

    else if(status === 'Thunderstorm'){

        document.body.style.backgroundImage = "url('thunderstorm.jpg')";
    }

    else if(status === 'Drizzle'){

        document.body.style.backgroundImage = "url('drizzle.jpg')";
    }

    else if(

        status === 'Mist' ||

        status === 'Haze' ||

        status === 'Fog'
    ){

        document.body.style.backgroundImage = "url('mist.jpg')";
    }

    else{

        document.body.style.backgroundImage = "url('bg.jpg')";
    }

    document.body.style.backgroundSize = "cover";

    document.body.style.backgroundPosition = "center";

    document.body.style.backgroundRepeat = "no-repeat";
}

// Weather Icons

function getIconClass(classarg){

    if(classarg === 'Rain'){

        return 'fas fa-cloud-showers-heavy';
    }

    else if(classarg === 'Clouds'){

        return 'fas fa-cloud';
    }

    else if(classarg === 'Clear'){

        return 'fas fa-sun';
    }

    else if(classarg === 'Snow'){

        return 'fas fa-snowflake';
    }

    else if(

        classarg === 'Thunderstorm' ||

        classarg === 'Drizzle'
    ){

        return 'fas fa-bolt';
    }

    else if(

        classarg === 'Mist' ||

        classarg === 'Haze' ||

        classarg === 'Fog'
    ){

        return 'fas fa-smog';
    }

    else{

        return 'fas fa-cloud-sun';
    }
}

// Reset Input

function reset(){

    document.getElementById('input-box').value = "";
}

// Add Zero

function addZero(i){

    if(i < 10){

        i = "0" + i;
    }

    return i;
}
