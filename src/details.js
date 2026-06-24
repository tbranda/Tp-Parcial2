const API_KEY = import.meta.env.VITE_WEATHER_API_KEY;

const params = new URLSearchParams(window.location.search);
const cityName = params.get('city');
const cityTitle = document.getElementById('city-title');
const detailContainer = document.getElementById('detail-container');

// Redirige si intentan entrar a la página sin pasar una ciudad por la URL
if (!cityName) {
  window.location.href = 'index.html';
}

// Fetch para el pronóstico de 5 días
async function fetchForecast(city) {
  const url = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${API_KEY}&units=metric&lang=es`;
  const response = await fetch(url);
  if (!response.ok) throw new Error('No se pudo obtener el pronóstico');
  return await response.json();
}

async function loadDetails() {
  try {
    const data = await fetchForecast(cityName);
    cityTitle.textContent = `Pronóstico para: ${data.city.name} (${data.city.country})`;

    //Filtrado para quedarnos con una sola muestra por día
    const dailyForecast = data.list.filter(item => item.dt_txt.includes('12:00:00'));
    detailContainer.innerHTML = '';
    dailyForecast.forEach(day => {
      const dateOption = { weekday: 'long', day: 'numeric', month: 'short' };
      const formattedDate = new Date(day.dt_txt).toLocaleDateString('es-ES', dateOption);
      
      // Icono oficial de la API
      const iconCode = day.weather[0].icon;
      const card = document.createElement('div');
      card.className = 'forecast-card';
      card.innerHTML = `
        <h3>${formattedDate}</h3>
        <img src="https://openweathermap.org/img/wn/${iconCode}@2x.png" alt="Clima" width="80">
        <p class="temp">${Math.round(day.main.temp)}°C</p>
        <p>Humedad: ${day.main.humidity}%</p>
        <p style="text-transform: capitalize;">${day.weather[0].description}</p>
      `;
      detailContainer.appendChild(card);
    });
  } catch (error) {
    detailContainer.innerHTML = `<p class="error-msg">❌ Error al cargar los datos: ${error.message}</p>`;
  }
}

loadDetails();