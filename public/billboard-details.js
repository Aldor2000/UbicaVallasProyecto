// billboard-details.js

// Función para obtener parámetros de la URL
function getQueryParam(param) {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(param);
}

// Función para actualizar la página con los datos de la valla
function displayBillboard(billboard) {
  if (!billboard) return;

  // Campos principales
  document.querySelector(".right h1").textContent = `Valla ${billboard.location}`;
  document.querySelector(".right .location").textContent = billboard.address || billboard.location;
  document.querySelector(".right .price").textContent = `$${billboard.price}/mes`;

  // Status
  const statusEl = document.querySelector(".status");
  statusEl.textContent = billboard.status;
  if (billboard.status.toLowerCase() === "ocupada") {
    statusEl.style.backgroundColor = "var(--danger-color)";
  } else {
    statusEl.style.backgroundColor = "var(--success-color)";
  }

  // Info cards
  const infoCards = document.querySelectorAll(".info-card");
  infoCards[0].innerHTML = `${billboard.size} <br><small>Categoría de Tamaño</small>`;
  infoCards[1].innerHTML = `${billboard.material} <br><small>Material</small>`;

  // Descripción
  document.querySelector(".box:nth-of-type(1) p").textContent = billboard.description;

  // Especificaciones técnicas
  const specs = document.querySelector(".box:nth-of-type(2) ul");
  specs.innerHTML = `
    <li><strong>Ancho:</strong> ${billboard.width}'</li>
    <li><strong>Alto:</strong> ${billboard.height}'</li>
    <li><strong>Material:</strong> ${billboard.material}</li>
    <li><strong>Área Total:</strong> ${billboard.total_area} pies²</li>
    <li><strong>Nivel de Tráfico:</strong> <span class="badge">${billboard.status}</span></li>
  `;

  // Foto
  const imgContainer = document.querySelector(".billboard-img");
  if (billboard.photo_url) {
    imgContainer.style.backgroundImage = `url(${billboard.photo_url})`;
    imgContainer.style.backgroundSize = "cover";
    imgContainer.style.backgroundPosition = "center";
  }

  // Disponibilidad
  const availability = document.querySelector(".box.unavailable p");
  if (billboard.status.toLowerCase() === "ocupada") {
    availability.innerHTML = `<span class="icon">⚠️</span> Actualmente Ocupada<br>Esta valla está siendo utilizada actualmente por otro anunciante`;
  } else {
    availability.innerHTML = `<span class="icon">✅</span> Disponible para reserva`;
    document.querySelector(".box.unavailable").classList.remove("unavailable");
  }
}

// Inicializar página
document.addEventListener("DOMContentLoaded", async () => {
  const billboardId = getQueryParam("id");
  if (!billboardId) return;

  try {
    // Llamada al backend
    const response = await fetch(`/api/billboards/${billboardId}`);
    if (!response.ok) throw new Error("Error al obtener la valla");
    const data = await response.json();
    displayBillboard(data);
  } catch (error) {
    console.error(error);
    alert("No se pudo cargar la información de la valla.");
  }
});
