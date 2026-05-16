const apiKey = "deO8t2nbwpcWWvx2rW8xAVUf0A6dbAc6";

/* =========================
   MAIN WEATHER FUNCTION
========================= */
async function getWeather(defaultCity = null) {

  // Get city from input OR default city
  const city =
    defaultCity || document.getElementById("city").value;

  if (!city) {
    alert("Please enter a city");
    return;
  }

  // Set input value automatically
  document.getElementById("city").value = city;

  const realtimeURL =
    `https://api.tomorrow.io/v4/weather/realtime?location=${city}&apikey=${apiKey}`;

  const forecastURL =
    `https://api.tomorrow.io/v4/weather/forecast?location=${city}&apikey=${apiKey}`;

  try {

    /* =========================
       REALTIME WEATHER
    ========================= */

    const res1 = await fetch(realtimeURL);

    if (!res1.ok) {
      throw new Error("City not found");
    }

    const data1 = await res1.json();

    const values = data1.data.values;

    const temp = Math.round(values.temperature);
    const feels = Math.round(values.temperatureApparent);
    const humidity = values.humidity;
    const wind = values.windSpeed;
    const code = values.weatherCode;

    document.getElementById("location").innerText = city;

    document.getElementById("temp").innerText =
      temp + "°C";

    document.getElementById("desc").innerText =
      "Feels like " + feels + "°C";

    // Optional extra details
    if (document.getElementById("humidity")) {
      document.getElementById("humidity").innerText =
        humidity + "%";
    }

    if (document.getElementById("wind")) {
      document.getElementById("wind").innerText =
        wind + " km/h";
    }

    // Set weather theme
    setTheme(code);

    /* =========================
       FORECAST
    ========================= */

    const res2 = await fetch(forecastURL);

    const data2 = await res2.json();

    // Correct forecast path
    const daily =
      data2.timelines.daily;

    showForecast(daily);

  } catch (error) {

    console.log(error);

    alert("Error fetching weather data");

  }
}

/* =========================
   FORECAST (5 DAYS)
========================= */
function showForecast(days) {

  const forecastBox =
    document.getElementById("forecast");

  forecastBox.innerHTML = "";

  for (let i = 1; i <= 5; i++) {

    const day = days[i];

    const d = day.values;

    const date = new Date(day.time);

    const dayName =
      date.toLocaleDateString("en-US", {
        weekday: "short"
      });

    const card = document.createElement("div");

    card.className = "forecast-card";

    card.innerHTML = `
      <h4>${dayName}</h4>
      <p>🌡 ${Math.round(d.temperatureAvg)}°C</p>
      <p>🌧 ${d.precipitationProbability}%</p>
    `;

    forecastBox.appendChild(card);
  }
}

/* =========================
   WEATHER THEME SYSTEM
========================= */
function setTheme(code) {

  document.body.className = "";

  // Clear
  if (code === 1000) {

    document.body.classList.add("clear");

  }

  // Cloudy
  else if (code >= 1001 && code <= 1102) {

    document.body.classList.add("clouds");

  }

  // Rain
  else if (code >= 4000 && code < 5000) {

    document.body.classList.add("rainy");

    startRain();

  }

  // Snow
  else if (code >= 5000) {

    document.body.classList.add("snowy");

    startSnow();

  }

  // Mist/Fog
  else {

    document.body.classList.add("mist");

  }
}

/* =========================
   RAIN ANIMATION
========================= */
function startRain() {

  for (let i = 0; i < 60; i++) {

    let drop = document.createElement("div");

    drop.className = "rain";

    drop.style.left =
      Math.random() * window.innerWidth + "px";

    drop.style.animationDuration =
      Math.random() * 1 + 0.5 + "s";

    document.body.appendChild(drop);

    setTimeout(() => {
      drop.remove();
    }, 2000);
  }
}

/* =========================
   SNOW ANIMATION
========================= */
function startSnow() {

  for (let i = 0; i < 40; i++) {

    let snow = document.createElement("div");

    snow.className = "snow";

    snow.style.left =
      Math.random() * window.innerWidth + "px";

    document.body.appendChild(snow);

    setTimeout(() => {
      snow.remove();
    }, 3000);
  }
}

/* =========================
   ENTER KEY SUPPORT
========================= */
document
  .getElementById("city")
  .addEventListener("keypress", function (e) {

    if (e.key === "Enter") {
      getWeather();
    }

  });

/* =========================
   AUTO LOAD DEFAULT CITY
========================= */
window.onload = () => {

  getWeather("Pune");

};
