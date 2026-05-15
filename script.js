const weatherApi = {

    key: "df7dcacdc4ca9073762c2b558f681943",

    baseUrl:
    "https://api.openweathermap.org/data/2.5/weather"
};

let inputBox =
document.getElementById("input-box");

/* Search */
inputBox.addEventListener("keypress",(event)=>{

    if(event.key === "Enter"){

        getWeather(inputBox.value.trim());

    }

});

/* Get Weather */
function getWeather(city){

    if(city === ""){

        swal(
            "Empty Input",
            "Please enter city",
            "error"
        );

        return;
    }

    fetch(
        `${weatherApi.baseUrl}?q=${city}&appid=${weatherApi.key}&units=metric`
    )

    .then(response=>response.json())

    .then(data=>{

        if(data.cod != 200){

            swal(
                "Error",
                data.message,
                "error"
            );

            return;
        }

        showWeather(data);

    });

}

/* Show Weather */
function showWeather(weather){

    let weatherBody =
    document.getElementById("weather-body");

    weatherBody.style.display = "block";

    weatherBody.innerHTML = `

        <div class="city">
            ${weather.name}, ${weather.sys.country}
        </div>

        <div class="temp">
            ${Math.round(weather.main.temp)}°C
        </div>

        <div class="weather">
            ${weather.weather[0].main}
        </div>

        <div class="details">

            <div class="card">
                <h4>Humidity</h4>
                <p>${weather.main.humidity}%</p>
            </div>

            <div class="card">
                <h4>Wind</h4>
                <p>${weather.wind.speed} km/h</p>
            </div>

        </div>
    `;

    changeBackground(
        weather.weather[0].main
    );
}

/* Background */
function changeBackground(status){

    let body = document.body;

    if(status === "Clear"){

        body.style.backgroundImage =
        "url('images/clear.jpg')";
    }

    else if(status === "Clouds"){

        body.style.backgroundImage =
        "url('images/clouds.jpg')";
    }

    else if(status === "Rain"){

        body.style.backgroundImage =
        "url('images/rain.jpg')";
    }

    else if(status === "Snow"){

        body.style.backgroundImage =
        "url('images/snow.jpg')";
    }

    else{

        body.style.backgroundImage =
        "url('images/bg.jpg')";
    }

}
