// ====== WEATHER WIDGET (Google Maps Platform Weather API) ======
const GOOGLE_KEY = "AIzaSyB9T093qUAX2Ih7dURB3krlpw98i4Ufe0M";       // tu misma key de Google Maps
const DEFAULT_CITY = "Chihuahua, MX";         // fallback si no hay geolocalización

const W = {
  box:  document.getElementById('weatherBox'),
  icon: document.getElementById('weatherIcon'),
  temp: document.getElementById('weatherTemp'),
  city: document.getElementById('weatherCity'),
  desc: document.getElementById('weatherDesc'),
  refresh: document.getElementById('refreshWeather')
};

// Mapear el "type" de Google Weather a tus clases/iconos
function conditionToClassFromGoogle(type){
  const t = (type || "").toUpperCase(); // p.ej. CLEAR, CLOUDY, RAIN, THUNDERSTORM, SNOW, FOG
  if (t.includes("CLEAR")) return "clear";
  if (t.includes("CLOUD")) return "clouds";
  if (t.includes("RAIN") || t.includes("DRIZZLE")) return "rain";
  if (t.includes("THUNDER")) return "thunder";
  if (t.includes("SNOW")) return "snow";
  if (t.includes("FOG") || t.includes("MIST") || t.includes("HAZE")) return "mist";
  return "clouds";
}

// Reusa tus SVGs existentes:
function iconSVG(main){ /* <- deja exactamente tu misma función */ return /* ...tus SVGs... */ }

async function fetchJson(url){
  const res = await fetch(url);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

// 1) Obtener clima por coordenadas con Google Weather API
async function getWeatherByCoords(lat, lon){
  // unitsSystem=METRIC para °C
  const url = `https://weather.googleapis.com/v1/currentConditions:lookup` +
              `?key=${GOOGLE_KEY}&location.latitude=${lat}&location.longitude=${lon}&unitsSystem=METRIC`;
  return fetchJson(url);
}

// 2) Geocodificar la ciudad (si no hay GPS) con Geocoding API de Google
async function geocodeCity(q){
  const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(q)}&key=${GOOGLE_KEY}`;
  const data = await fetchJson(url);
  const r = data.results?.[0];
  if (!r) throw new Error("No geocode result");
  const { lat, lng } = r.geometry.location;
  return { lat, lon: lng, formatted: r.formatted_address };
}

async function loadWeather(){
  try {
    W.desc.textContent = 'Cargando…';
    W.box.classList.remove('clear','clouds','rain','thunder','snow','mist');

    // 1) Intentar GPS primero
    const pos = await new Promise((resolve, reject) => {
      if (!navigator.geolocation) return reject(new Error('no-geo'));
      navigator.geolocation.getCurrentPosition(
        p => resolve(p),
        err => reject(err),
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
      );
    }).catch(() => null);

    let weather, cityLabel = "";
    if (pos) {
      const { latitude, longitude } = pos.coords;
      weather = await getWeatherByCoords(latitude, longitude);
      cityLabel = "Tu ubicación";
    } else {
      // 2) Fallback por ciudad usando Geocoding -> Weather
      const geo = await geocodeCity(DEFAULT_CITY);
      weather = await getWeatherByCoords(geo.lat, geo.lon);
      cityLabel = geo.formatted || DEFAULT_CITY;
    }

    // --- Normalizar respuesta de Google Weather ---
    // Doc: weather.googleapis.com/v1/currentConditions:lookup
    const type = weather.weatherCondition?.type || "";                 // p.ej. CLEAR
    const desc = weather.weatherCondition?.description?.text || "";    // p.ej. "Sunny"
    const temp = Math.round(weather.temperature?.degrees ?? 0);

    W.temp.textContent = temp;
    W.city.textContent = cityLabel;
    W.desc.textContent = desc;
    W.icon.innerHTML = iconSVG(type);
    W.box.classList.add(conditionToClassFromGoogle(type));
  } catch (e) {
    console.error("Weather error:", e);
    W.desc.textContent = 'No se pudo cargar el clima';
    W.icon.innerHTML = '';
  }
}

W.refresh?.addEventListener('click', (ev) => { ev.preventDefault(); loadWeather(); });
loadWeather();
