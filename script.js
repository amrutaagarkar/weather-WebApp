const apiKey = "9b14b2cbfdfa41f6b63172731261605";

const cityInput = document.getElementById("city");
const weatherDiv = document.getElementById("weather");

let chartInstance = null;

/* =========================
   🔔 NOTIFICATION SETUP
========================= */

// Ask permission once
if ("Notification" in window) {
  Notification.requestPermission();
}

// Service Worker (for future push upgrades)
if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("sw.js").catch(err =>
    console.log("SW error:", err)
  );
}

/* =========================
   🌦 WEATHER FETCH
========================= */

document.getElementById("search-btn").onclick = () => {
  if (cityInput.value.trim()) getWeather(cityInput.value);
};

cityInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") getWeather(cityInput.value);
});

document.getElementById("location-btn").onclick = () => {
  navigator.geolocation.getCurrentPosition((pos) => {
    const { latitude, longitude } = pos.coords;
    fetchWeather(`${latitude},${longitude}`);
  });
};

document.getElementById("dark-btn").onclick = () => {
  document.body.classList.toggle("dark");
};

/* =========================
   FETCH WEATHER
========================= */

function getWeather(city) {
  fetchWeather(city);
  saveSearch(city);
}

function fetchWeather(q) {
  fetch(
    `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${q}&days=7&aqi=yes`
  )
    .then((res) => res.json())
    .then((data) => {
      if (data.error) {
        alert(data.error.message);
        return;
      }
      render(data);
    })
    .catch(() => alert("Failed to fetch weather"));
}

/* =========================
   🚨 WEATHER ALERT SYSTEM
========================= */

function checkWeatherAlerts(data) {
  const c = data.current;

  const condition = c.condition.text.toLowerCase();
  const wind = c.wind_kph;
  const rain = c.precip_mm;

  let message = "";

  if (condition.includes("thunder")) {
    message = "⚠️ Thunderstorm detected in your area!";
  } 
  else if (condition.includes("storm")) {
    message = "⛈️ Storm warning issued!";
  } 
  else if (rain > 5) {
    message = "🌧️ Heavy rain expected!";
  } 
  else if (wind > 40) {
    message = "💨 Strong wind alert!";
  }

  if (message) sendNotification(message);
}

/* =========================
   📲 PUSH NOTIFICATION
========================= */

function sendNotification(message) {
  if ("Notification" in window && Notification.permission === "granted") {
    new Notification("Weather Alert 🚨", {
      body: message,
      icon: "https://cdn-icons-png.flaticon.com/512/1116/1116453.png",
    });
  }
}

/* =========================
   📊 RENDER UI
========================= */

function render(data) {
  weatherDiv.style.display = "block";

  const c = data.current;
  const loc = data.location;
  const f = data.forecast.forecastday;

  // 🚨 RUN ALERT CHECK
  checkWeatherAlerts(data);

  weatherDiv.innerHTML = `
    <div class="top">
      <div>
        <h2>${loc.name}, ${loc.country}</h2>
        <p>${loc.localtime}</p>
        <div class="temp">${c.temp_c}°C</div>
        <p>${c.condition.text}</p>
      </div>
      <img src="https:${c.condition.icon}">
    </div>

    <div class="grid">
      <div class="card"><h3>Humidity</h3><p>${c.humidity}%</p></div>
      <div class="card"><h3>Wind</h3><p>${c.wind_kph} km/h</p></div>
      <div class="card"><h3>Pressure</h3><p>${c.pressure_mb}</p></div>
      <div class="card"><h3>UV</h3><p>${c.uv}</p></div>
      <div class="card">
        <h3>Air</h3>
        <p>${c.air_quality ? Math.round(c.air_quality.pm2_5) : "N/A"}</p>
      </div>
      <div class="card"><h3>Sunrise</h3><p>${f[0].astro.sunrise}</p></div>
      <div class="card"><h3>Sunset</h3><p>${f[0].astro.sunset}</p></div>
    </div>

    <h3>Hourly Forecast</h3>
    <div class="hourly-container">
      ${f[0].hour.slice(0, 12).map(h => `
        <div class="hour-card">
          <p>${h.time.split(" ")[1]}</p>
          <img src="https:${h.condition.icon}">
          <p>${h.temp_c}°C</p>
        </div>
      `).join("")}
    </div>

    <h3>7 Day Forecast</h3>
    <div class="forecast-container">
      ${f.map(d => `
        <div class="forecast-card">
          <p>${new Date(d.date).toDateString().slice(0, 3)}</p>
          <img src="https:${d.day.condition.icon}">
          <p>${d.day.avgtemp_c}°C</p>
        </div>
      `).join("")}
    </div>

    <canvas id="chart"></canvas>
  `;

  drawChart(f);
  loadHistory();
}

/* =========================
   📈 CHART
========================= */

function drawChart(f) {
  const ctx = document.getElementById("chart");

  if (chartInstance) chartInstance.destroy();

  chartInstance = new Chart(ctx, {
    type: "line",
    data: {
      labels: f.map(d => d.date.slice(5)),
      datasets: [{
        label: "Temperature °C",
        data: f.map(d => d.day.avgtemp_c),
        borderWidth: 2
      }]
    }
  });
}

/* =========================
   💾 SEARCH HISTORY
========================= */

function saveSearch(city) {
  let h = JSON.parse(localStorage.getItem("history") || "[]");
  if (!h.includes(city)) h.push(city);
  localStorage.setItem("history", JSON.stringify(h));
}

function loadHistory() {
  const div = document.getElementById("history");
  let h = JSON.parse(localStorage.getItem("history") || "[]");

  div.innerHTML = h.slice(-5).map(c =>
    `<span onclick="getWeather('${c}')">${c}</span>`
  ).join("");
}
