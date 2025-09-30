// public/cards.js
document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById("billboards-list");

  fetch("/api/billboards")
    .then((res) => res.json())
    .then((data) => {
      data.forEach((billboard) => {
        // Card contenedor
        const card = document.createElement("div");
        card.className = "card";

        // Foto
        const photoDiv = document.createElement("div");
        photoDiv.className = "card-photo";
        const img = document.createElement("img");
        img.className = "card-img";
        img.src = billboard.photo_url || "images/default.jpg";
        img.alt = billboard.location;
        photoDiv.appendChild(img);

        // Status
        const statusDiv = document.createElement("div");
        statusDiv.className = "card-status";
        const statusText = document.createElement("span");
        statusText.className = "status-text";
        statusText.textContent = billboard.status;
        statusDiv.appendChild(statusText);
        photoDiv.appendChild(statusDiv);

        // Header
        const headerDiv = document.createElement("div");
        headerDiv.className = "card-header";
        const title = document.createElement("p");
        title.className = "card-title";
        title.textContent = billboard.location;
        headerDiv.appendChild(title);

        // Contenido
        const contentDiv = document.createElement("div");
        contentDiv.className = "card-content";

        // Dirección
        const locationDiv = document.createElement("div");
        locationDiv.className = "card-content-section";
        const locText = document.createElement("span");
        locText.className = "location-direction";
        locText.textContent = billboard.address;
        locationDiv.appendChild(locText);
        contentDiv.appendChild(locationDiv);

        // Tamaño
        const sizeDiv = document.createElement("div");
        sizeDiv.className = "card-content-section space";
        sizeDiv.innerHTML = `
          <div class="card-info">
            <span class="billboard-badge-size">Size:</span>
            <span class="billboard-size">${billboard.size}</span>
          </div>
          <div class="card-info">
            <span class="billboard-mesure">${billboard.width} m x ${billboard.height} m</span>
          </div>
        `;
        contentDiv.appendChild(sizeDiv);

        // Material
        const materialDiv = document.createElement("div");
        materialDiv.className = "card-content-section space";
        materialDiv.innerHTML = `
          <span class="billboard-badge-material">Material:</span>
          <span class="billboard-material">${billboard.material}</span>
        `;
        contentDiv.appendChild(materialDiv);

        // Detalles
        const detailsDiv = document.createElement("div");
        detailsDiv.className = "card-content-section details";
        const detailsLink = document.createElement("a");
        detailsLink.className = "details-link";
        detailsLink.href = `/billboard.html?id=${billboard.id}`;
        detailsLink.innerHTML = `
          <img class="card-details-icon" src="icons/eye.png" alt="details icon"/>
          <span class="details-text">View Details</span>
        `;
        detailsDiv.appendChild(detailsLink);
        contentDiv.appendChild(detailsDiv);

        // Armar card
        card.appendChild(photoDiv);
        card.appendChild(headerDiv);
        card.appendChild(contentDiv);

        // Insertar al contenedor
        container.appendChild(card);
      });
    })
    .catch((err) => console.error("❌ Error al cargar vallas:", err));
});
