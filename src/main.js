const API_KEY = import.meta.env.VITE_WEATHER_API_KEY; 

// Acumulador de ciudades buscadas (Intentamos recuperar lo guardado, si no empieza vacío )
let citiesList = JSON.parse(localStorage.getItem('mis_ciudades')) || [];

const searchForm = document.getElementById('search-form');
const searchInput = document.getElementById('search-input');
const filterSelect = document.getElementById('filter-select');
const cardsContainer = document.getElementById('cards-container');
const errorMessage = document.getElementById('error-message');

// Sugerencias de autocompletado
const autocompleteSuggestions = document.createElement('div');
autocompleteSuggestions.className = 'autocomplete-suggestions';
searchInput.parentNode.appendChild(autocompleteSuggestions);

// Renderizamos automáticamente las ciudades que recuperamos del localStorage
processAndRender();

async function fetchSuggestions(query) {
  const url = `https://api.openweathermap.org/geo/1.0/direct?q=${query}&limit=5&appid=${API_KEY}`;
  const response = await fetch(url);
  if (!response.ok) return [];
  return await response.json();
}

// Detecto cuando el usuario escribe en la barra de búsqueda
searchInput.addEventListener('input', async () => {
  const query = searchInput.value.trim();
  if (query.length < 3) {
    autocompleteSuggestions.innerHTML = '';
    return;
  }

  const suggestions = await fetchSuggestions(query);
  autocompleteSuggestions.innerHTML = '';

  suggestions.forEach(place => {
    const item = document.createElement('div');
    item.className = 'suggestion-item';
    item.textContent = `${place.name} (${place.country})`;
    
    // Al hacer clic en una sugerencia, se autocompleta el input y limpia la lista desplegable
    item.addEventListener('click', () => {
      searchInput.value = `${place.name},${place.country}`;
      autocompleteSuggestions.innerHTML = '';
    });
    autocompleteSuggestions.appendChild(item);
  });
});

// Cierra la lista de sugerencias si el usuario hace clic afuera de la barra
document.addEventListener('click', (e) => {
  if (e.target !== searchInput) {
    autocompleteSuggestions.innerHTML = '';
  }
});

async function fetchWeather(city) {
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric&lang=es`;
  const response = await fetch(url);
  if (!response.ok) throw new Error('Ciudad no encontrada');
  return await response.json();
}

function renderCards(data) {
  cardsContainer.innerHTML = '';
  if (data.length === 0) {
    cardsContainer.innerHTML = '<p>No hay ciudades que coincidan con el filtro.</p>';
    return;
  }

  data.forEach(city => {
    // Icono oficial de la API
    let iconCode = city.weather[0].icon;
    
    // Forzamos que use la versión diurna si el código devuelto termina en 'n'
    if (iconCode.endsWith('n')) {
      iconCode = iconCode.slice(0, -1) + 'd';
    }

    const card = document.createElement('div');
    card.className = 'weather-card';
    card.innerHTML = `
      <h3>${city.name} (${city.sys.country})</h3>
      <img src="https://openweathermap.org/img/wn/${iconCode}@2x.png" alt="Clima" width="80">
      <p class="temp">${Math.round(city.main.temp)}°C</p>
      <p style="text-transform: capitalize; font-size: 0.9rem; color: var(--text-muted);">${city.weather[0].description}</p>
      <button class="btn-detail" data-city="${city.name}">Ver Detalles extendidos</button>
    `;
    cardsContainer.appendChild(card);
  });

  document.querySelectorAll('.btn-detail').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const cityName = e.target.getAttribute('data-city');
      window.location.href = `details.html?city=${cityName}`;
    });
  });
}

// Filtra la lista acumulada
function processAndRender() {
  let result = [...citiesList];

  const filterVal = filterSelect.value;
  if (filterVal === 'hot') result = result.filter(c => c.main.temp >= 20);
  if (filterVal === 'cold') result = result.filter(c => c.main.temp < 20);

  renderCards(result);
}

// Evento de Búsqueda del Formulario
searchForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  errorMessage.textContent = '';
  const query = searchInput.value.trim();

  try {
    const data = await fetchWeather(query);
    
    // Evitamos duplicados en la lista de ciudades
    let yaExiste = false;
    for (let i = 0; i < citiesList.length; i++) {
      if (citiesList[i].id === data.id) {
        yaExiste = true;
        break;
      }
    }

    // Si no está repetida, la sumamos al array principal (así no desaparecen las anteriores)
    if (!yaExiste) {
      citiesList.push(data);
      // Guardamos la lista actualizada en el almacenamiento local del navegador
      localStorage.setItem('mis_ciudades', JSON.stringify(citiesList));
    }
    
    searchInput.value = '';
    processAndRender();
  } catch (error) {
    errorMessage.textContent = `No se encontró la ciudad. Intenta de nuevo.`;
  }
});

filterSelect.addEventListener('change', processAndRender);