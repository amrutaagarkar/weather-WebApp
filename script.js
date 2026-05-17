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
