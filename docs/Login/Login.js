// Login.js (type="module")

// 1) Importar Firebase (v10.x modular desde CDN)
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { 
  getAuth, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword 
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

// 2) Configura tu Firebase (PEGA AQUÍ TU CONFIG REAL)
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

// 3) Inicializar
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// 4) URL a donde redirigir al iniciar sesión correctamente
const REDIRECT_URL = "../Home/Home.html";

// Helpers de UI
const $ = (sel) => document.querySelector(sel);
const registerForm = $("#registerForm");
const registerMsg  = $("#registerMsg");
const loginForm    = $("#loginForm");
const loginMsg     = $("#loginMsg");

// Limpia y muestra mensajes
function showMsg(el, text, type = "info") {
  if (!el) return;
  el.textContent = text;
  el.classList.remove("ok", "error", "info");
  el.classList.add(type);
}
function clearMsgs() {
  showMsg(registerMsg, "", "info");
  showMsg(loginMsg, "", "info");
}

// 5) REGISTRO
if (registerForm) {
  registerForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    clearMsgs();

    const formData = new FormData(registerForm);
    const name = (formData.get("name") || "").trim();
    const email = (formData.get("email") || "").trim();
    const password = (formData.get("password") || "").trim();
    const confirm = (formData.get("confirm") || "").trim();

    if (!name || !email || !password || !confirm) {
      showMsg(registerMsg, "Completa todos los campos.", "error");
      return;
    }
    if (password !== confirm) {
      showMsg(registerMsg, "Las contraseñas no coinciden.", "error");
      return;
    }
    if (password.length < 6) {
      showMsg(registerMsg, "La contraseña debe tener al menos 6 caracteres.", "error");
      return;
    }

    try {
      await createUserWithEmailAndPassword(auth, email, password);
      showMsg(registerMsg, "Registro exitoso. Ahora puedes iniciar sesión.", "ok");
      registerForm.reset();
    } catch (err) {
      // Mapeo de errores comunes
      const map = {
        "auth/email-already-in-use": "Este correo ya está registrado.",
        "auth/invalid-email": "Correo inválido.",
        "auth/weak-password": "La contraseña es demasiado débil.",
        "auth/network-request-failed": "Problema de red, intenta de nuevo.",
      };
      showMsg(registerMsg, map[err.code] || "No se pudo registrar. Intenta más tarde.", "error");
      console.error(err);
    }
  });
}

// 6) LOGIN (solo correo y contraseña)
if (loginForm) {
  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    clearMsgs();

    const formData = new FormData(loginForm);
    const email = (formData.get("email") || "").trim();
    const password = (formData.get("password") || "").trim();

    if (!email || !password) {
      showMsg(loginMsg, "Ingresa correo y contraseña.", "error");
      return;
    }

    try {
      await signInWithEmailAndPassword(auth, email, password);
      // Correcto → Redirigir
      window.location.href = REDIRECT_URL;
    } catch (err) {
      // Mensajes específicos
      const map = {
        "auth/user-not-found": "El usuario no existe.",
        "auth/wrong-password": "Contraseña incorrecta.",
        "auth/invalid-credential": "Correo o contraseña incorrectos.",
        "auth/too-many-requests": "Demasiados intentos. Intenta más tarde.",
        "auth/network-request-failed": "Problema de red, intenta de nuevo.",
      };
      showMsg(loginMsg, map[err.code] || "No se pudo iniciar sesión.", "error");
      console.error(err);
    }
  });
}

// (Opcional) Si tienes un botón para cambiar paneles, aquí lo mantienes:
const switchBtn = document.getElementById("switchBtn");
if (switchBtn) {
  switchBtn.addEventListener("click", () => {
    // Puedes alternar clases si tu CSS soporta el cambio visual
    document.querySelector(".auth-wrapper")?.classList.toggle("swap");
  });
}
