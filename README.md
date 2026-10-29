# Soundify - Reproductor de Música YouTube & Bluetooth para Android

Soundify es una aplicación móvil con diseño moderno estilo **Spotify** que te permite crear listas de reproducción personalizadas a partir de **URLs de videos de YouTube** y reproducirlas en altavoces, estéreos de auto o auriculares mediante **Bluetooth**.

---

## 🌟 Características Principales

- **Diseño Spotify Dark Mode:**
  - Carátulas dinámicas con degradados automáticos.
  - Reproductor inferior (Mini-Player) interactivo.
  - Modo Pantalla Completa estilo Spotify con barra de progreso milimétrica, animación de ondas y carátula gigante.
  - Control de volumen, modo aleatorio (Shuffle) y repetición en bucle (Repeat 1 / Repeat All).

- **Gestión de Playlists & Canciones:**
  - Crea tantas listas de reproducción como quieras con colores personalizados.
  - Agrega canciones pegando cualquier URL de YouTube (`youtube.com/watch?v=...`, `youtu.be/...` o `youtube.com/shorts/...`).
  - Detección automática del título del video, artista y carátula en alta definición.
  - Sección de **"Canciones que te gustan"** (Favoritos con corazón).
  - Cola de reproducción (Queue) para ver qué canción sonará a continuación.

- **Integración Nativa con Bluetooth:**
  - Salida de audio automática por cualquier dispositivo Bluetooth conectado (auriculares, parlantes, radio del coche).
  - Soporte para la API **MediaSession**:
    - Cambia de canción o pausa usando los toques en tus auriculares Bluetooth o los mandos del volante del auto.
    - Notificación multimedia en la barra de estado y pantalla de bloqueo de Android con nombre y carátula.

- **Almacenamiento Local:**
  - Todas tus listas y canciones se guardan de forma persistente en tu dispositivo (LocalStorage).

---

## 🚀 Cómo Probarla Inmediatamente en tu Navegador o Celular

1. En la carpeta del proyecto:
   ```bash
   npm run dev
   ```
2. Abre la URL en tu navegador (por ejemplo `http://localhost:3000`).
3. Para probarla en tu celular directamente:
   - Conecta tu celular a la misma red Wi-Fi de tu computadora.
   - Abre la dirección IP de tu PC que muestra Vite (ejemplo: `http://192.168.1.XX:3000`).

---

## 📱 Cómo Generar el archivo APK para Android

El proyecto ya cuenta con la estructura nativa completa de **Capacitor Android** en la carpeta `/android`. Puedes compilar el `.apk` de las siguientes maneras:

### Opción 1: Con Android Studio (Recomendada)
1. Si tienes o instalas [Android Studio](https://developer.android.com/studio):
2. Abre el proyecto ejecutando:
   ```bash
   npx cap open android
   ```
3. En el menú superior de Android Studio ve a:
   **Build** > **Build Bundle(s) / APK(s)** > **Build APK(s)**.
4. Tu archivo `app-debug.apk` se creará listo para instalar en cualquier teléfono Android.

### Opción 2: Compilación Automática en la Nube (GitHub Actions - Sin instalar nada en tu PC)
Hemos incluido un flujo automatizado en `.github/workflows/build-apk.yml`:
1. Sube este proyecto a tu repositorio de GitHub.
2. Cada vez que hagas un push, GitHub compilará automáticamente el proyecto en sus servidores.
3. Descarga directamente el archivo `Soundify-Android-APK` desde la pestaña **Actions** de tu repositorio.

---

## 🛠️ Tecnologías Utilizadas

- **React 19 & TypeScript**
- **Vite & Tailwind CSS v4**
- **Capacitor 8** (Empaquetado nativo para Android)
- **YouTube IFrame API & oEmbed API**
- **Web MediaSession API** (Controles Bluetooth y pantalla de bloqueo)
- **Lucide Icons**
