const apiKey = "9b14b2cbfdfa41f6b63172731261605";


let map;
let marker;

// WEATHER
function getWeather(city){

if(!city) city = document.getElementById("city").value;

fetch(`https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${city}&days=7&aqi=yes`)
.then(res => res.json())
.then(data => {

document.getElementById("weather").innerHTML = `
<h2>${data.location.name}</h2>
<p>${data.current.temp_c}°C</p>
<p>${data.current.condition.text}</p>
`;

loadMap(data.location.lat, data.location.lon);
loadChart(data.forecast.forecastday);

sendNotification(data);

});
}

// LOCATION
function getLocation(){

navigator.geolocation.getCurrentPosition(pos => {

let lat = pos.coords.latitude;
let lon = pos.coords.longitude;

fetch(`https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${lat},${lon}&days=7`)
.then(res => res.json())
.then(data => getWeather(data.location.name));

});
}

// MAP (RADAR STYLE)
function loadMap(lat, lon){

if(!map){
map = L.map('map').setView([lat, lon], 10);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);
}

if(marker){
map.removeLayer(marker);
}

marker = L.marker([lat, lon]).addTo(map);
map.setView([lat, lon], 10);
}
const weatherIcons = forecast.map(d => "https:" + d.day.condition.icon);

Chart.register({
id: 'weatherIcons',
afterDatasetsDraw(chart) {

const { ctx } = chart;

chart.getDatasetMeta(0).data.forEach((point, i) => {

const img = new Image();
img.src = weatherIcons[i];

ctx.drawImage(img, point.x - 12, point.y - 40, 25, 25);

});

}
});

// CHART
function createChart(forecast){

const labels = forecast.map(day =>
new Date(day.date).toLocaleDateString('en-US', { weekday: 'short' })
);

const tempData = forecast.map(day => day.day.avgtemp_c);
const humidityData = forecast.map(day => day.day.avghumidity);
const rainData = forecast.map(day => day.day.daily_chance_of_rain);
const icons = forecast.map(day => "https:" + day.day.condition.icon);

const ctx = document.getElementById("tempChart");

new Chart(ctx, {

type: 'line',

data: {

labels: labels,

datasets: [

{
label: 'Temperature (°C)',
data: tempData,
borderColor: '#ff6384',
backgroundColor: 'rgba(255,99,132,0.2)',
tension: 0.4,
fill: true,
pointRadius: 6,
pointHoverRadius: 10,
pointBackgroundColor: '#fff'
},

{
label: 'Humidity (%)',
data: humidityData,
borderColor: '#36a2eb',
backgroundColor: 'rgba(54,162,235,0.2)',
tension: 0.4,
fill: true,
pointRadius: 6,
pointHoverRadius: 10
},

{
label: 'Rain Chance (%)',
data: rainData,
borderColor: '#4bc0c0',
backgroundColor: 'rgba(75,192,192,0.2)',
tension: 0.4,
fill: true,
pointRadius: 6,
pointHoverRadius: 10
}

]

},

options: {

responsive: true,

interaction: {
mode: 'index',
intersect: false
},

plugins: {

legend: {
labels: {
color: "white"
}
},

tooltip: {

callbacks: {

afterLabel: function(context){

let i = context.dataIndex;
return "Condition: " + forecast[i].day.condition.text;

}

}

}

},

scales: {

x: {
ticks: { color: "white" }
},

y: {
ticks: { color: "white" }
}

},

elements: {
point: {

pointStyle: function(context){

// WEATHER ICONS ON POINTS
return new Image().src = icons[context.dataIndex];

}

}
}

}

});

}

// FAVORITES
function addFavorite(){
let city = document.getElementById("city").value;

let fav = JSON.parse(localStorage.getItem("fav")) || [];
fav.push(city);

localStorage.setItem("fav", JSON.stringify(fav));

alert("Added to favorites!");
}

// NOTIFICATIONS
function sendNotification(data){

if(Notification.permission !== "granted"){
Notification.requestPermission();
}

if(Notification.permission === "granted"){
new Notification("Weather Update", {
body: `${data.location.name} is ${data.current.temp_c}°C`
});
}
}

// AUTO LOAD DEFAULT
document.addEventListener("DOMContentLoaded", function () {

const apiKey = "9b14b2cbfdfa41f6b63172731261605";

const cityInput = document.getElementById("city");

console.log(cityInput);

});
// Search Button

document.getElementById("search-btn")
.addEventListener("click",()=>{

if(cityInput.value.trim() !== ""){

getWeather(cityInput.value);

}

});

// Enter Key

cityInput.addEventListener("keypress",(e)=>{

if(e.key === "Enter"){

getWeather(cityInput.value);

}

});

// Dark Mode

document.getElementById("dark-btn")
.addEventListener("click",()=>{

document.body.classList.toggle("dark");

});

// My Location

document.getElementById("location-btn")
.addEventListener("click",()=>{

navigator.geolocation.getCurrentPosition(

(position)=>{

const lat =
position.coords.latitude;

const lon =
position.coords.longitude;

fetch(`https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${lat},${lon}&days=7&aqi=yes`)
.then(response=>response.json())
.then(data=>{

showWeather(data);

});

}

);

});

// Get Weather

function getWeather(city){

fetch(`https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${city}&days=7&aqi=yes`)
.then(response=>response.json())
.then(data=>{

console.log(data);

if(data.error){

alert(data.error.message);

return;

}

saveSearch(city);

showWeather(data);

})

.catch(error=>{

console.log(error);

alert("Failed to fetch weather");

});

}

// Show Weather

function showWeather(data){

weather.style.display = "block";

const current =
data.current;

const location =
data.location;

const forecast =
data.forecast.forecastday;

// Dynamic Background

changeBackground(
current.condition.text
);

weather.innerHTML = `

<div class="top">

<div>

<h2>
${location.name},
${location.country}
</h2>

<p>
${location.localtime}
</p>

<div class="temp">
${current.temp_c}°C
</div>

<div class="condition">
${current.condition.text}
</div>

</div>

<div class="main-icon">

<img src="https:${current.condition.icon}">

</div>

</div>

<div class="grid">

<div class="card">
<h3>Humidity</h3>
<p>${current.humidity}%</p>
</div>

<div class="card">
<h3>Wind</h3>
<p>${current.wind_kph} KM/H</p>
</div>

<div class="card">
<h3>Pressure</h3>
<p>${current.pressure_mb} mb</p>
</div>

<div class="card">
<h3>UV Index</h3>
<p>${current.uv}</p>
</div>

<div class="card">
<h3>Air Quality</h3>

<p>
${current.air_quality
? Math.round(current.air_quality.pm2_5)
: "N/A"}
</p>

</div>

<div class="card">
<h3>Sunrise</h3>
<p>${forecast[0].astro.sunrise}</p>
</div>

<div class="card">
<h3>Sunset</h3>
<p>${forecast[0].astro.sunset}</p>
</div>

</div>

<h2 style="margin-top:35px;">
24 Hour Forecast
</h2>

<div
class="hourly-container"
id="hourly-container">
</div>

<h2 style="margin-top:35px;">
7 Day Forecast
</h2>

<div class="forecast-container">

${forecast.map(day=>`

<div class="forecast-card">

<h3>

${new Date(day.date)
.toLocaleDateString(
'en-US',
{weekday:'short'}
)}

</h3>

<img src="https:${day.day.condition.icon}">

<p>
${day.day.avgtemp_c}°C
</p>

<p>
${day.day.condition.text}
</p>

</div>

`).join("")}

</div>

<canvas id="tempChart"></canvas>
`;

showHourly(
forecast[0].hour
);

createChart(forecast);

loadHistory();

}

// Hourly Forecast

function showHourly(hourData){

const container =
document.getElementById(
"hourly-container"
);

container.innerHTML = "";

hourData.slice(0,24)
.forEach(hour=>{

let time =
hour.time.split(" ")[1];

container.innerHTML += `

<div class="hour-card">

<h3>
${time}
</h3>

<img
src="https:${hour.condition.icon}">

<p>
${hour.temp_c}°C
</p>

</div>
`;

});

}

// Temperature Chart

function createChart(forecast){

const labels =
forecast.map(day=>

new Date(day.date)
.toLocaleDateString(
'en-US',
{weekday:'short'}
)

);

const temps =
forecast.map(day=>

day.day.avgtemp_c

);

new Chart(

document.getElementById(
"tempChart"
),

{

type:'line',

data:{

labels:labels,

datasets:[{

label:'Temperature °C',

data:temps,

borderWidth:3,

tension:0.4

}]

}

}

);

}

// Search History

function saveSearch(city){

let history = JSON.parse(

localStorage.getItem(
"history"
)

) || [];

if(!history.includes(city)){

history.push(city);

localStorage.setItem(

"history",

JSON.stringify(history)

);

}

}

// Load History

function loadHistory(){

const historyDiv =
document.getElementById(
"history"
);

if(!historyDiv) return;

let history = JSON.parse(

localStorage.getItem(
"history"
)

) || [];

historyDiv.innerHTML = "";

history.reverse()
.slice(0,5)
.forEach(city=>{

historyDiv.innerHTML += `

<span
onclick="getWeather('${city}')">

${city}

</span>
`;

});

}

// Dynamic Background

function changeBackground(condition){

condition =
condition.toLowerCase();

if(condition.includes("rain")){

document.body.style.background =
"linear-gradient(to right,#4b79a1,#283e51)";

}

else if(condition.includes("cloud")){

document.body.style.background =
"linear-gradient(to right,#757f9a,#d7dde8)";

}

else if(condition.includes("clear")){

document.body.style.background =
"linear-gradient(to right,#56ccf2,#2f80ed)";

}

else if(condition.includes("snow")){

document.body.style.background =
"linear-gradient(to right,#e6dada,#274046)";

}

else{

document.body.style.background =
"linear-gradient(to right,#1d4350,#a43931)";

}

}

// Load Previous Searches

loadHistory();
