# TP 2 - Sistema Climático

 Es una aplicación web multipágina desarrollada con **HTML, CSS y JavaScript Vanilla**, utilizando **Vite** como entorno de desarrollo. La app consume datos en tiempo real desde la API pública de **OpenWeatherMap**.

---

##  Proceso de Diseño e Interfaz

* **Metodología de Estilos:** Adoptamos un enfoque **Desktop First** para consolidar primero la experiencia en pantallas grandes con layouts minimalistas y limpios.
* **Adaptación Responsiva:** Mediante el uso de Media Queries adaptamos la interfaz a dispositivos móviles (celulares y tablets), asegurando que las tarjetas meteorológicas y los formularios fluyan verticalmente sin generar desbordamientos horizontales.

---

##  Requerimientos e Interactividad Implementados

* **Buscador con Autocompletado:** El input de búsqueda incluye un sistema de sugerencias dinámico usando la API de Geocodificación de OpenWeather, detallando el país correspondiente entre paréntesis `()` para ciudades homónimas.
* **Filtrado Inteligente:** Los datos se pueden filtrar en tiempo real según criterios de temperatura (Climas cálidos > 20°C o Climas fríos < 20°C).
* **Persistencia de Datos (LocalStorage):** Las tarjetas buscadas por el usuario se acumulan en el inicio y no se pierden al navegar o regresar desde otra vista.
* **Flujo Multipágina:** Cuenta con un archivo `index.html` principal y una página `details.html` para consultar el pronóstico extendido de los próximos 5 días de cada ciudad seleccionada.
* **Manejo de Errores:** Control estricto de excepciones mediante bloques `try/catch` para alertar visualmente al usuario si una ciudad no es encontrada.

---

##  Instalación y Configuración Local

Para levantar el entorno de desarrollo y probar la aplicación:

1. Clonar este repositorio.
2. Crear un archivo `.env` en la raíz del proyecto (este archivo se encuentra configurado en el `.gitignore` para proteger las credenciales).
3. Añadir tu clave privada dentro del `.env` de la siguiente manera:
   VITE_WEATHER_API_KEY=tu_api_key_aqui