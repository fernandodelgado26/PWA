let map;
let marker;
let followUser = true; // cambia a false si no quieres que el mapa siga tu ubicación

function initMap() {
  // Inicializa el mapa
  map = new google.maps.Map(document.getElementById("map"), {
    zoom: 16,
    center: { lat: 0, lng: 0 },
    mapTypeId: "roadmap"
  });

  // Intenta seguir tu ubicación en tiempo real
  if ("geolocation" in navigator) {
    navigator.geolocation.watchPosition(
      pos => {
        const { latitude, longitude } = pos.coords;
        const latLng = new google.maps.LatLng(latitude, longitude);

        if (!marker) {
          marker = new google.maps.Marker({
            position: latLng,
            map: map,
            title: "Estás aquí"
          });
        } else {
          marker.setPosition(latLng);
        }

        if (followUser) {
          map.setCenter(latLng);
        }

        document.getElementById("mapNote").textContent =
          "Seguimiento en tiempo real activo.";
      },
      err => {
        console.error("Error geolocalización:", err.message);
        document.getElementById("mapNote").textContent =
          "No se pudo obtener tu ubicación.";
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  } else {
    document.getElementById("mapNote").textContent =
      "Tu navegador no soporta geolocalización.";
  }
}
