// map.js

// Inicializar mapa centrado en Bolivia (ajusta según tus datos)
const map = L.map('map').setView([-16.5, -68.1], 6);

// Capa de OpenStreetMap
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '© OpenStreetMap contributors'
}).addTo(map);

// Referencias a los filtros
const statusFilter = document.getElementById('status-filter');
const sizeFilter = document.getElementById('size-filter');
const countElement = document.getElementById('billboard-count');

// Grupo de marcadores para manejar zoom automáticamente
let markersGroup = L.featureGroup().addTo(map);

// Función para cargar los marcadores desde el backend
function loadMarkers() {
  // Limpiar los marcadores anteriores
  markersGroup.clearLayers();

  // Construir query string según filtros
  const status = statusFilter.value;
  const size = sizeFilter.value;
  let query = '';
  if (status) query += `status=${status}&`;
  if (size) query += `size=${size}&`;

  fetch('/api/billboards/locations?' + query)
    .then(res => res.json())
    .then(data => {
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

      // Ajustar el mapa para mostrar todos los marcadores
      if (markersGroup.getLayers().length > 0) {
        map.fitBounds(markersGroup.getBounds());
      }

      // Actualizar contador de billboards mostrados
      countElement.textContent = `Showing ${markersGroup.getLayers().length} of ${data.length} billboards`;
    })
    .catch(err => console.error('Error cargando los marcadores:', err));
}

// Cargar marcadores inicialmente
loadMarkers();

// Recargar marcadores cuando cambian los filtros
statusFilter.addEventListener('change', loadMarkers);
sizeFilter.addEventListener('change', loadMarkers);
