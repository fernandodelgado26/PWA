// ====== WEATHER WIDGET (OpenWeatherMap) ======
const OWM_KEY = "e3ac3f2829e07b7948d7096747ddc9e3";          // <-- pon aquí tu API key de OpenWeatherMap
const DEFAULT_CITY = "Chihuahua, MX";            // fallback si falla la geolocalización
const FORCE_CITY = "Ciudad Juarez, MX"; // si quieres forzar una ciudad específica, descomenta esta línea y comenta la anterior
const API = "https://api.openweathermap.org/data/2.5/weather";
const WEATHER_CLASSES = ["clear","clouds","rain","thunder","snow","mist"];

const W = {
  box:  document.getElementById("weatherBox"),
  icon: document.getElementById("weatherIcon"),
  temp: document.getElementById("weatherTemp"),
  city: document.getElementById("weatherCity"),
  desc: document.getElementById("weatherDesc"),
  refresh: document.getElementById("refreshWeather")
};

// Mapea condiciones de OWM a clases de tu CSS
function conditionToClassFromOWM(main, id) {
  const m = (main || "").toLowerCase();
  if (m.includes("clear")) return "clear";
  if (m.includes("cloud")) return "clouds";
  if (m.includes("rain") || m.includes("drizzle")) return "rain";
  if (m.includes("thunder")) return "thunder";
  if (m.includes("snow")) return "snow";
  if (m.includes("mist") || m.includes("fog") || m.includes("haze")) return "mist";
  // Por ID (más fino, opcional)
  if (id >= 200 && id < 300) return "thunder";
  if (id >= 300 && id < 600) return "rain";
  if (id >= 600 && id < 700) return "snow";
  if (id >= 700 && id < 800) return "mist";
  if (id === 800) return "clear";
  if (id > 800) return "clouds";
  return "clouds";
}

// Iconos rápidos en SVG (puedes reemplazar por los tuyos)
function iconSVG(main) {
  const m = (main || "").toLowerCase();
  if (m.includes("clear")) {
    return `<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="5"/><g stroke="currentColor" stroke-linecap="round"><line x1="12" y1="1" x2="12" y2="4"/><line x1="12" y1="20" x2="12" y2="23"/><line x1="1" y1="12" x2="4" y2="12"/><line x1="20" y1="12" x2="23" y2="12"/><line x1="4.2" y1="4.2" x2="6.3" y2="6.3"/><line x1="17.7" y1="17.7" x2="19.8" y2="19.8"/><line x1="17.7" y1="6.3" x2="19.8" y2="4.2"/><line x1="4.2" y1="19.8" x2="6.3" y2="17.7"/></g></svg>`;
  }
  if (m.includes("cloud")) {
    return `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 18a5 5 0 1 1 2-9 6 6 0 1 1 7 8H7z"/></svg>`;
  }
  if (m.includes("rain") || m.includes("drizzle")) {
    return `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 16a5 5 0 1 1 2-9 6 6 0 1 1 7 8H7z"/><path d="M8 20l-1 3M12 20l-1 3M16 20l-1 3" stroke="currentColor" stroke-linecap="round"/></svg>`;
  }
  if (m.includes("thunder")) {
    return `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 16a5 5 0 1 1 2-9 6 6 0 1 1 7 8H7z"/><path d="M12 12l-2 4h2l-1 4 4-6h-2l1-2z"/></svg>`;
  }
  if (m.includes("snow")) {
    return `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 16a5 5 0 1 1 2-9 6 6 0 1 1 7 8H7z"/><g stroke="currentColor"><line x1="8" y1="20" x2="8" y2="22"/><line x1="12" y1="20" x2="12" y2="22"/><line x1="16" y1="20" x2="16" y2="22"/></g></svg>`;
  }
  // mist / default
  return `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 7h18M3 11h18M3 15h18" stroke="currentColor" stroke-linecap="round"/></svg>`;
}

async function fetchJSON(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

async function getWeatherByCoords(lat, lon) {
  const url = `${API}?lat=${lat}&lon=${lon}&appid=${OWM_KEY}&units=metric&lang=es`;
  return fetchJSON(url);
}

async function getWeatherByCity(q) {
  const url = `${API}?q=${encodeURIComponent(q)}&appid=${OWM_KEY}&units=metric&lang=es`;
  return fetchJSON(url);
}

function renderWeather(data, labelOverride) {
  // Limpia clases de estado
  W.box.classList.remove(...WEATHER_CLASSES);

  const w0 = data.weather && data.weather[0] ? data.weather[0] : {};
  const main = w0.main || "";
  const id   = w0.id || 0;
  const cls  = conditionToClassFromOWM(main, id);

  W.temp.textContent = Math.round(data.main?.temp ?? 0);
  W.city.textContent = labelOverride || `${data.name || ""}${data.sys?.country ? ", " + data.sys.country : ""}`;
  W.desc.textContent = (w0.description || main || "").toLowerCase();
  W.icon.innerHTML = iconSVG(main);
  W.box.classList.add(cls);
}

async function loadWeather() {
  try {
    W.desc.textContent = "Cargando…";
    W.icon.innerHTML = "";

    // SIEMPRE traer por ciudad fija (ignora geolocalización)
    const data = await getWeatherByCity(FORCE_CITY);

    // Mostrar el nombre fijo tal cual
    renderWeather(data, FORCE_CITY);
  } catch (e) {
    console.error("Weather error:", e);
    W.desc.textContent = "No se pudo cargar el clima";
  }
}
// Botón “Refrescar”
W.refresh?.addEventListener("click", (ev) => {
  ev.preventDefault();
  loadWeather();
});

// Primer load
loadWeather();
