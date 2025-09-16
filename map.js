// Mock data: replace with your real billboard locations
const billboards = [
  { id: 1, status: "available", size: "large", lat: -16.5, lng: -68.15, name: "Av. Santos Dumont" },
  { id: 2, status: "occupied", size: "medium", lat: -16.52, lng: -68.13, name: "Av. Cristo Redentor" },
  { id: 3, status: "available", size: "small", lat: -16.48, lng: -68.14, name: "Av. Arce" },
  { id: 4, status: "available", size: "medium", lat: -16.51, lng: -68.12, name: "Av. 6 de Agosto" },
  { id: 5, status: "occupied", size: "large", lat: -16.49, lng: -68.11, name: "Av. Ballivián" },
  { id: 6, status: "available", size: "small", lat: -16.47, lng: -68.13, name: "C. Jaén" }
];

let currentStatusFilter = "";
let currentSizeFilter = "";

const statusFilterEl = document.getElementById("status-filter");
const sizeFilterEl = document.getElementById("size-filter");
const billboardCountEl = document.getElementById("billboard-count");

let map;  // Leaflet map

// Custom icon creation function
function createCustomIcon(status) {
  const iconColor = status === 'available' ? 'green' : 'red';
  
  return L.divIcon({
    className: 'custom-marker',
    html: `<div style="background-color: ${iconColor}; width: 24px; height: 24px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);"></div>`,
    iconSize: [24, 24],
    iconAnchor: [12, 12]
  });
}

function initMap() {
  map = L.map("map").setView([-16.5, -68.15], 13);  // adjust the center & zoom

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  }).addTo(map);

  renderMarkers(billboards);
}

function renderMarkers(data) {
  // Clear existing markers if needed: maintain a layer group
  if (map.markerGroup) {
    map.removeLayer(map.markerGroup);
  }
  
  const markerGroup = L.layerGroup();
  
  data.forEach(b => {
    const marker = L.marker([b.lat, b.lng], { icon: createCustomIcon(b.status) })
      .bindPopup(`
        <div class="map-popup">
          <h3>${b.name}</h3>
          <p><strong>Status:</strong> ${b.status === 'available' ? 'Available' : 'Occupied'}</p>
          <p><strong>Size:</strong> ${b.size}</p>
          <a href="billboard-details.html?id=${b.id}" class="details-link" style="display: inline-block; margin-top: 10px;">
            View Details
          </a>
        </div>
      `)
      .addTo(markerGroup);
  });
  
  markerGroup.addTo(map);
  map.markerGroup = markerGroup;
}

function applyFilters() {
  currentStatusFilter = statusFilterEl.value;
  currentSizeFilter = sizeFilterEl.value;
  updateView();
}

function updateView() {
  const filtered = billboards.filter(b => {
    let ok = true;
    if (currentStatusFilter && b.status !== currentStatusFilter) ok = false;
    if (currentSizeFilter && b.size !== currentSizeFilter) ok = false;
    return ok;
  });
  renderMarkers(filtered);
  billboardCountEl.textContent = `Showing ${filtered.length} of ${billboards.length} billboards`;
}

document.addEventListener("DOMContentLoaded", () => {
  initMap();
  updateView();
  statusFilterEl.addEventListener("change", applyFilters);
  sizeFilterEl.addEventListener("change", applyFilters);
});