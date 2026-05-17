const apiKey = "9b14b2cbfdfa41f6b63172731261605";

const cityInput = document.getElementById("city");
const weather = document.getElementById("weather");

/* ================= MAP ================= */
let map;
let marker;

function initMap() {
  map = L.map('map').setView([20.5937, 78.9629], 5);

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap'
  }).addTo(map);

  marker = L.marker([20.5937, 78.9629]).addTo(map);
}

window.onload = initMap;

/* ================= LIGHTNING ================= */
function startLightning() {
  const flash = document.getElementById("lightning");

  setInterval(() => {
    if (Math.random() > 0.7) {
      flash.classList.add("flash");
      setTimeout(() => flash.classList.remove("flash"), 300);
    }
  }, 3000);
}

/* ================= WEATHER EFFECTS ================= */
function setWeatherEffects(condition) {
  const bg = document.getElementById("weather-bg");
  bg.innerHTML = "";

  document.body.classList.remove("storm");

  const text = condition.toLowerCase();

  if (text.includes("thunder") || text.includes("storm")) {
    document.body.classList.add("storm");
    startLightning();

    for (let i = 0; i < 5; i++) {
      let cloud = document.createElement("div");
      cloud.style.position = "absolute";
      cloud.style.width = "120px";
      cloud.style.height = "60px";
      cloud.style.background = "white";
      cloud.style.borderRadius = "50px";
      cloud.style.top = Math.random() * 200 + "px";
      cloud.style.left = Math.random() * 100 + "vw";
      bg.appendChild(cloud);
    }
  }

  else if (text.includes("rain")) {
    for (let i = 0; i < 50; i++) {
      let drop = document.createElement("div");
      drop.style.position = "absolute";
      drop.style.width = "2px";
      drop.style.height = "15px";
      drop.style.background = "#00aaff";
      drop.style.left = Math.random() * 100 + "vw";
      drop.style.animation = "fall 1s linear infinite";
      bg.appendChild(drop);
    }
  }

  else if (text.includes("clear")) {
    let sun = document.createElement("div");
    sun.style.width = "80px";
    sun.style.height = "80px";
    sun.style.background = "yellow";
    sun.style.borderRadius = "50%";
    sun.style.position = "absolute";
    sun.style.top = "80px";
    sun.style.right = "100px";
    bg.appendChild(sun);
  }
}

/* ================= SEARCH ================= */
document.getElementById("search-btn")
.addEventListener("click", () => {
  if (cityInput.value.trim() !== "") {
    getWeather(cityInput.value);
  }
});

/* ENTER KEY */
cityInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    getWeather(cityInput.value);
  }
});

/* ================= GET WEATHER ================= */
function getWeather(city) {

  fetch(`https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${city}&days=7&aqi=yes`)
    .then(res => res.json())
    .then(data => {

      if (data.error) {
        alert(data.error.message);
        return;
      }

      showWeather(data);
    })
    .catch(() => alert("Failed to fetch weather"));
}

/* ================= SHOW WEATHER ================= */
function showWeather(data) {

  weather.style.display = "block";

  const current = data.current;
  const location = data.location;
  const forecast = data.forecast.forecastday;

  /* WEATHER EFFECTS */
  setWeatherEffects(current.condition.text);

  weather.innerHTML = `
    <div class="top">

      <div>
        <h2>${location.name}, ${location.country}</h2>
        <p>${location.localtime}</p>

        <div class="temp">${current.temp_c}°C</div>
        <div class="condition">${current.condition.text}</div>
      </div>

      <div class="main-icon">
        <img src="https:${current.condition.icon}">
      </div>

    </div>

    <div class="grid">

      <div class="card"><h3>Humidity</h3><p>${current.humidity}%</p></div>
      <div class="card"><h3>Wind</h3><p>${current.wind_kph} KM/H</p></div>
      <div class="card"><h3>Pressure</h3><p>${current.pressure_mb} mb</p></div>
      <div class="card"><h3>UV Index</h3><p>${current.uv}</p></div>

      <div class="card">
        <h3>Air Quality</h3>
        <p>${current.air_quality ? Math.round(current.air_quality.pm2_5) : "N/A"}</p>
      </div>

      <div class="card"><h3>Sunrise</h3><p>${forecast[0].astro.sunrise}</p></div>
      <div class="card"><h3>Sunset</h3><p>${forecast[0].astro.sunset}</p></div>

    </div>

    <h2>24 Hour Forecast</h2>
    <div class="hourly-container" id="hourly-container"></div>

    <h2>7 Day Forecast</h2>

    <div class="forecast-container">
      ${forecast.map(day => `
        <div class="forecast-card">
          <h3>${new Date(day.date).toLocaleDateString('en-US', { weekday: 'short' })}</h3>
          <img src="https:${day.day.condition.icon}">
          <p>${day.day.avgtemp_c}°C</p>
          <p>${day.day.condition.text}</p>
        </div>
      `).join("")}
    </div>

    <canvas id="tempChart"></canvas>
  `;

  showHourly(forecast[0].hour);
  createChart(forecast);

  /* MAP UPDATE FIX */
  if (map && marker) {
    map.setView([location.lat, location.lon], 10);
    marker.setLatLng([location.lat, location.lon]);
  }
}

/* ================= HOURLY ================= */
function showHourly(hourData) {

  const container = document.getElementById("hourly-container");
  container.innerHTML = "";

  hourData.slice(0, 24).forEach(hour => {

    let time = hour.time.split(" ")[1];

    container.innerHTML += `
      <div class="hour-card">
        <h3>${time}</h3>
        <img src="https:${hour.condition.icon}">
        <p>${hour.temp_c}°C</p>
      </div>
    `;
  });
}

/* ================= CHART ================= */
function createChart(forecast) {

  const labels = forecast.map(day =>
    new Date(day.date).toLocaleDateString('en-US', { weekday: 'short' })
  );

  const temps = forecast.map(day => day.day.avgtemp_c);

  new Chart(document.getElementById("tempChart"), {
    type: 'line',
    data: {
      labels: labels,
      datasets: [{
        label: 'Temperature °C',
        data: temps,
        borderWidth: 3,
        tension: 0.4
      }]
    }
  });
}
