// map.js

// Inicializar mapa centrado en Bolivia
const map = L.map('map').setView([-16.5, -68.1], 6);

// Capa de OpenStreetMap
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);

// Grupo de marcadores
const markersGroup = L.layerGroup().addTo(map);

// Elementos de filtros y contador
const statusFilter = document.getElementById('status-filter');
const sizeFilter = document.getElementById('size-filter');
const countElement = document.getElementById('billboard-count');

// Función para cargar los marcadores
function loadMarkers() {
  markersGroup.clearLayers();

  const query = new URLSearchParams();
  if (statusFilter.value) query.append('status', statusFilter.value);
  if (sizeFilter.value) query.append('size', sizeFilter.value);

  fetch('/api/billboards/locations?' + query.toString())
    .then(res => res.json())
    .then(data => {
      if (!Array.isArray(data)) {
        console.error('Error: data no es un array', data);
        return;
      }

      data.forEach(billboard => {
        if (billboard.latitude && billboard.longitude) {
          const marker = L.marker([billboard.latitude, billboard.longitude])
            .bindPopup(`
              <b>${billboard.location}</b><br>
              Status: ${billboard.status}<br>
              Size: ${billboard.size}
            `);
          markersGroup.addLayer(marker);
        }
      });

      if (markersGroup.getLayers().length > 0) {
        map.fitBounds(markersGroup.getBounds());
      }

      countElement.textContent = `Showing ${markersGroup.getLayers().length} of ${data.length} billboards`;
    })
    .catch(err => console.error('Error cargando los marcadores:', err));
}

// Cargar marcadores al iniciar
loadMarkers();

// Actualizar marcadores cuando cambian los filtros
statusFilter.addEventListener('change', loadMarkers);
sizeFilter.addEventListener('change', loadMarkers);
