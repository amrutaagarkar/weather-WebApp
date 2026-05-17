const apiKey = "9b14b2cbfdfa41f6b63172731261605";

let map;
let marker;

/* INIT MAP */
function initMap() {
  map = L.map('map').setView([20.5937, 78.9629], 5);

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap'
  }).addTo(map);

  marker = L.marker([20.5937, 78.9629]).addTo(map);
}

document.addEventListener("DOMContentLoaded", initMap);

/* GET WEATHER */
async function getWeather() {

  const city = document.getElementById("city").value;

  const res = await fetch(
    `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${city}&days=1&aqi=no`
  );

  const data = await res.json();

  if(data.error){
    alert(data.error.message);
    return;
  }

  showWeather(data);
}

/* SHOW WEATHER */
function showWeather(data){

  const current = data.current;
  const location = data.location;
  const hours = data.forecast.forecastday[0].hour;

  document.getElementById("weather").innerHTML = `
    <h2>${location.name}, ${location.country}</h2>
    <h1>${current.temp_c}°C</h1>
    <p>${current.condition.text}</p>
  `;

  /* MAP UPDATE */
  map.setView([location.lat, location.lon], 10);
  marker.setLatLng([location.lat, location.lon]);

  /* HOURLY TEMPERATURE */
  showHourly(hours);

  /* CHART */
  createChart(hours);
}

/* HOURLY VIEW */
function showHourly(hours){

  const container = document.getElementById("hourly");
  container.innerHTML = "";

  hours.slice(0,24).forEach(h => {

    container.innerHTML += `
      <div class="hour-card">
        <p>${h.time.split(" ")[1]}</p>
        <p>${h.temp_c}°C</p>
      </div>
    `;
  });
}

/* HOURLY CHART */
function createChart(hours){

  const labels = hours.slice(0,24).map(h => h.time.split(" ")[1]);
  const temps = hours.slice(0,24).map(h => h.temp_c);

  new Chart(document.getElementById("chart"), {
    type: "line",
    data: {
      labels: labels,
      datasets: [{
        label: "Hourly Temperature °C",
        data: temps,
        borderWidth: 2,
        tension: 0.4
      }]
    }
  });
}
