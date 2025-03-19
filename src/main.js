"use strict";

/**
 * Hämtar in karta från Leaflet, startar marker på Stockholm
 * @constant {Object} map - kartan startar på Sockholm innan användaren har sökt på en plats
 */
const map = L.map('map').setView([59.3293, 18.0686], 10);

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);

const marker = L.marker([59.3293, 18.0686]).addTo(map);

/**
 * Funktion som uppdaterar kartan efter sökning 
 * @param {string} searchInput - hämtar in vad anvädaren sökt för plats
 */
function getMap() {
    const searchInput = document.getElementById('search-place').value;
    const mapUrl = `https://nominatim.openstreetmap.org/search?format=json&q=${searchInput}`;

    fetch(mapUrl) 
        .then(response => response.json())
        .then(data => {
            if(data.length > 0) {
                const lat = data[0].lat;
                const lon = data[0].lon;

                map.setView([lat, lon], 10);
                marker.setLatLng([lat, lon]);

                getWeather(lat, lon);
            }
        })
        .catch(error => console.error("Problem med nätverksanslutning", error));
}

/**
 * Hämtar in väderinfo
 * @async
 * @function getWeather hämtar in väder från API
 * @throws {Error} - vid problem vid laddning av sidan
 */
async function getWeather(lat, lon) {
    try {
        const response = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&daily=rain_sum,uv_index_max&hourly=temperature_2m&current=temperature_2m&timezone=auto&forecast_days=1&wind_speed_unit=ms`);
        if(!response.ok) {
            throw new Error('Problem med nätverksanslutning')
        }
        const data = await response.json();
        writeWeather(data);
    } catch(error) {
        console.error('Problem vid hämtning av väder', error);
    }
}

/**
 * Funktion för att hämta in väderdatan
 * @param {Object} data - hämtar in temperatur, nederbörd och uv-index
 */
function writeWeather(data) {
    document.getElementById('temp').innerHTML = `Temperatur: ${data.current.temperature_2m} C`;
    document.getElementById('rain').innerHTML = `Nederbörd: ${data.daily.rain_sum[0]} mm`;
    document.getElementById('uv').innerHTML = `UV-index: ${data.daily.uv_index_max[0]}`;

    let sunEl = document.getElementById('sun');
    if(data.daily.uv_index_max[0] > 3) {
        sunEl.style.display = 'block';
    } else {
        sunEl.style.display = 'none';
    }

    let cloudEl = document.getElementById('cloud');
    if(data.daily.uv_index_max[0] < 3) {
        cloudEl.style.display = 'block';
    } else {
        cloudEl.style.display = 'none';
    }
}



/**
 * Eventlyssnare för sök-knappen
 */
document.getElementById('search').addEventListener('click', getMap);