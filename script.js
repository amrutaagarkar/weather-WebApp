let map = L.map("map", { zoomControl: true }).setView([20.59, 78.96], 5);

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution: "© OpenStreetMap"
}).addTo(map);

// radar state
let radarFrames = [];
let currentIndex = 0;
let radarLayers = [];

// load radar (rain + clouds)
async function loadRadar() {

  const res = await fetch("https://api.rainviewer.com/public/weather-maps.json");
  const data = await res.json();

  radarFrames = [
    ...data.radar.past,
    ...data.radar.nowcast
  ];

  animateRadar();
}

// animate like Google Weather
function animateRadar() {

  if (radarLayers.length) {
    radarLayers.forEach(l => map.removeLayer(l));
  }

  let frame = radarFrames[currentIndex];

  let layer = L.tileLayer(
    `https://tilecache.rainviewer.com${frame.path}/256/{z}/{x}/{y}/2/1_1.png`,
    {
      opacity: 0.55,
      zIndex: 100
    }
  ).addTo(map);

  radarLayers = [layer];

  currentIndex++;

  if (currentIndex >= radarFrames.length) {
    currentIndex = 0;
  }

  setTimeout(animateRadar, 450); // smooth Google-like animation speed
}

// auto refresh every 10 min
setInterval(loadRadar, 600000);

loadRadar();
