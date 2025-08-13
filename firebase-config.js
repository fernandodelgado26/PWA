// configfirebace.js  (CDN, sin bundler)
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
// (Opcional) Analytics solo si tu sitio está servido por HTTPS y lo tienes habilitado
// import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-analytics.js";

const firebaseConfig = {
  apiKey: "AIzaSyBll3R5lGL5qC2HLooDjSAI8R8fQORRKR4",
  authDomain: "coffeandblue-9c366.firebaseapp.com",
  projectId: "coffeandblue-9c366",
  // Revisa este valor EXACTO en la consola de Firebase > Storage
  // Si te aparece con appspot.com, cámbialo a "coffeandblue-9c366.appspot.com"
  storageBucket: "coffeandblue-9c366.firebasestorage.app",
  messagingSenderId: "751554749647",
  appId: "1:751554749647:web:3e48747ffbcfc312f203ba",
  measurementId: "G-MYEBBLWRX5"
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

// (Opcional) Analytics: solo si sirve y no quieres errores en local sin https
// export const analytics = getAnalytics(app);
