const apiKey = "deO8t2nbwpcWWvx2rW8xAVUf0A6dbAc6";

/* =========================
   MAIN WEATHER FUNCTION
========================= */
async function getWeather() {
  const city = document.getElementById("city").value;

  if (!city) {
    alert("Please enter a city");
    return;
  }

  const realtimeURL =
    `https://api.tomorrow.io/v4/weather/realtime?location=${city}&apikey=${apiKey}`;

  const forecastURL =
    `https://api.tomorrow.io/v4/weather/forecast?location=${city}&apikey=${apiKey}`;

  try {
    // 🌡 REAL-TIME WEATHER
    const res1 = await fetch(realtimeURL);
    const data1 = await res1.json();

    const values = data1.data.values;

    const temp = values.temperature;
    const feels = values.temperatureApparent;
    const code = values.weatherCode;

    document.getElementById("location").innerText = city;
    document.getElementById("temp").innerText = temp + "°C";
    document.getElementById("desc").innerText =
      "Feels like " + feels + "°C";

    setTheme(code);

    // 🌦 FORECAST WEATHER
    const res2 = await fetch(forecastURL);
    const data2 = await res2.json();

    showForecast(data2.timelines.daily);

  } catch (error) {
    console.log(error);
    alert("Error fetching weather data");
  }
}

/* =========================
   FORECAST (5 DAYS)
========================= */
function showForecast(days) {
  const forecastBox = document.getElementById("forecast");
  forecastBox.innerHTML = "";

  for (let i = 0; i < 5; i++) {
    const d = days[i].values;

    const card = document.createElement("div");
    card.className = "forecast-card";

    card.innerHTML = `
      <h4>Day ${i + 1}</h4>
      <p>🌡 ${d.temperatureAvg}°C</p>
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

  // ☀️ Clear
  if (code === 1000) {
    document.body.classList.add("clear");
  }

  // ☁️ Clouds
  else if (code >= 1001 && code <= 1100) {
    document.body.classList.add("clouds");
  }

  // 🌧 Rain
  else if (code >= 4000) {
    document.body.classList.add("rainy");
    startRain();
  }

  // ❄ Snow
  else if (code >= 5000) {
    document.body.classList.add("snowy");
    startSnow();
  }

  // 🌫 Mist
  else {
    document.body.classList.add("mist");
  }
}

/* =========================
   RAIN ANIMATION
========================= */
function startRain() {
  for (let i = 0; i < 50; i++) {
    let drop = document.createElement("div");
    drop.className = "rain";

    drop.style.left = Math.random() * window.innerWidth + "px";
    drop.style.animationDuration = Math.random() * 1 + 0.5 + "s";

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

    snow.style.left = Math.random() * window.innerWidth + "px";

    document.body.appendChild(snow);

    setTimeout(() => {
      snow.remove();
    }, 3000);
  }
}

/* =========================
   AUTO LOAD DEFAULT CITY
========================= */
window.onload = () => {
  getWeather("Pune");
};
