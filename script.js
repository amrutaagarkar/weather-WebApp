const apiKey = "9b14b2cbfdfa41f6b63172731261605";

const cityInput = document.getElementById("city");
const weatherDiv = document.getElementById("weather");

let chartInstance = null;
let map;

/* ================= SEARCH ================= */

document.getElementById("search-btn").onclick = () => {
if(cityInput.value.trim()) getWeather(cityInput.value);
};

cityInput.addEventListener("keypress",(e)=>{
if(e.key==="Enter") getWeather(cityInput.value);
});

/* ================= DARK MODE ================= */

document.getElementById("dark-btn").onclick = () => {
document.body.classList.toggle("dark");
};

/* ================= LOCATION ================= */

document.getElementById("location-btn").onclick = () => {
navigator.geolocation.getCurrentPosition(pos=>{
const lat = pos.coords.latitude;
const lon = pos.coords.longitude;
getWeather(`${lat},${lon}`);
});
};

/* ================= FETCH WEATHER ================= */

function getWeather(city){

fetch(`https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${city}&days=7&aqi=yes`)
.then(res=>res.json())
.then(data=>{

if(data.error){
alert(data.error.message);
return;
}

saveHistory(city);
showWeather(data);

})
.catch(()=>{
alert("Failed to fetch weather data");
});
}

/* ================= SHOW WEATHER ================= */

function showWeather(data){

const current = data.current;
const loc = data.location;
const forecast = data.forecast.forecastday;

weatherDiv.style.display = "block";

weatherDiv.innerHTML = `

<div class="top">
<div>
<h2>${loc.name}, ${loc.country}</h2>
<p>${loc.localtime}</p>
<div class="temp">${current.temp_c}°C</div>
<p>${current.condition.text}</p>
</div>

<img src="https:${current.condition.icon}">
</div>

<div class="grid">
<div class="card"><h3>Humidity</h3><p>${current.humidity}%</p></div>
<div class="card"><h3>Wind</h3><p>${current.wind_kph} km/h</p></div>
<div class="card"><h3>Pressure</h3><p>${current.pressure_mb} mb</p></div>
<div class="card"><h3>UV Index</h3><p>${current.uv}</p></div>
<div class="card"><h3>Sunrise</h3><p>${forecast[0].astro.sunrise}</p></div>
<div class="card"><h3>Sunset</h3><p>${forecast[0].astro.sunset}</p></div>
</div>

<h3>Hourly Forecast</h3>
<div class="hourly-container">
${forecast[0].hour.slice(0,12).map(h=>`
<div class="hour-card">
<p>${h.time.split(" ")[1]}</p>
<img src="https:${h.condition.icon}">
<p>${h.temp_c}°C</p>
</div>
`).join("")}
</div>

<h3>7 Day Forecast</h3>
<div class="forecast-container">
${forecast.map(d=>`
<div class="forecast-card">
<p>${new Date(d.date).toDateString().slice(0,10)}</p>
<img src="https:${d.day.condition.icon}">
<p>${d.day.avgtemp_c}°C</p>
</div>
`).join("")}
</div>

<canvas id="chart"></canvas>

<h3>Weather Map</h3>
<div id="map" style="height:300px;border-radius:15px;margin-top:15px;"></div>

`;

createChart(forecast);
loadMap(loc.lat, loc.lon);
loadHistory();
}

/* ================= CHART (ADVANCED APPLE STYLE) ================= */

function createChart(forecast){

const canvas = document.getElementById("chart");
const ctx = canvas.getContext("2d");

if(chartInstance){
chartInstance.destroy();
}

let gradient = ctx.createLinearGradient(0,0,0,400);
gradient.addColorStop(0,"rgba(0,184,148,0.6)");
gradient.addColorStop(1,"rgba(0,184,148,0.05)");

chartInstance = new Chart(ctx,{
type:"line",
data:{
labels:forecast.map(d=>
new Date(d.date).toLocaleDateString("en-US",{weekday:"short"})
),
datasets:[{
label:"Temperature °C",
data:forecast.map(d=>d.day.avgtemp_c),
borderColor:"#00b894",
backgroundColor:gradient,
fill:true,
tension:0.55,
pointRadius:6,
pointBackgroundColor:"#fff",
pointBorderColor:"#00b894",
pointBorderWidth:3
}]
},
options:{
responsive:true,
plugins:{
legend:{labels:{color:"#fff"}},
tooltip:{backgroundColor:"rgba(0,0,0,0.85)"}
},
scales:{
x:{ticks:{color:"#fff"},grid:{color:"rgba(255,255,255,0.1)"}},
y:{ticks:{color:"#fff"},grid:{color:"rgba(255,255,255,0.1)"}}
},
animation:{
duration:1500,
easing:"easeInOutQuart"
}
},

plugins:[{
afterDatasetsDraw(chart){
const {ctx} = chart;

forecast.forEach((d,i)=>{
let img = new Image();
img.src = "https:" + d.day.condition.icon;

img.onload = () => {
const meta = chart.getDatasetMeta(0);
const point = meta.data[i];
if(point){
ctx.drawImage(img, point.x-12, point.y-35, 24, 24);
}
};
});
}
}]
});

}

/* ================= MAP (LEAFLET) ================= */

function loadMap(lat, lon){

if(!document.getElementById("map")) return;

if(map){
map.remove();
}

map = L.map('map').setView([lat, lon], 10);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',{
attribution:'&copy; OpenStreetMap'
}).addTo(map);

L.marker([lat, lon])
.addTo(map)
.bindPopup("Current Weather Location")
.openPopup();
}

/* ================= HISTORY ================= */

function saveHistory(city){

let history = JSON.parse(localStorage.getItem("history")) || [];

if(!history.includes(city)){
history.push(city);
localStorage.setItem("history",JSON.stringify(history));
}

}

function loadHistory(){

let history = JSON.parse(localStorage.getItem("history")) || [];

const div = document.getElementById("history");

if(!div) return;

div.innerHTML = "";

history.slice(-5).reverse().forEach(c=>{
div.innerHTML += `<span onclick="getWeather('${c}')">${c}</span>`;
});

}
