// MAP INIT
let map = L.map('map').setView([20.5937, 78.9629], 5);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '© OpenStreetMap'
}).addTo(map);

let radarLayers = [];
let apiData = {};
let animationIndex = 0;
let animationTimer = null;

// LOAD RADAR DATA
async function loadRadar() {
  const res = await fetch("https://api.rainviewer.com/public/weather-maps.json");
  apiData = await res.json();

  const frames = apiData.radar.past.concat(apiData.radar.nowcast);

  playRadar(frames);
}

// ADD RADAR FRAME
function addRadarLayer(frame) {
  const layer = L.tileLayer(
    `https://tilecache.rainviewer.com${frame.path}/256/{z}/{x}/{y}/2/1_1.png`,
    {
      opacity: 0.5,
      zIndex: 10
    }
  );

  layer.addTo(map);
  radarLayers.push(layer);
}

// PLAY ANIMATION
function playRadar(frames) {

  // clear old layers
  radarLayers.forEach(l => map.removeLayer(l));
  radarLayers = [];

  if (animationTimer) clearInterval(animationTimer);

  animationIndex = 0;

  animationTimer = setInterval(() => {

    if (animationIndex >= frames.length) {
      animationIndex = 0;
    }

    radarLayers.forEach(l => map.removeLayer(l));
    radarLayers = [];

    addRadarLayer(frames[animationIndex]);

    animationIndex++;

  }, 600); // speed of animation
}

// AUTO START
loadRadar();
