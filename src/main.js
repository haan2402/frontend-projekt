"use strict";

/**
 * Hämtar in karta från Leaflet, startar marker på Stockholm
 */
const map = L.map('map').setView([59.3293, 18.0686], 10);

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);

const marker = L.marker([59.3293, 18.0686]).addTo(map);

/**
 * Funktion som uppdaterar kartan efter sökning 
 */
function getMap() {
    const searchInput = document.getElementById('search-place').value;
    const mapUrl = `https://nominatim.openstreetmap.org/search.php?format=json&q=${searchInput}`;

    fetch(mapUrl) 
        .then(response => response.json())
        .then(data => {
            if(data.length > 0) {
                const lat = data[0].lat;
                const lon = data[0].lat;

                map.setView([lat, lon], 10);
                marker.setLatLng([lat, lon]);

                getWeather(lat, lon);
            }
        })
        .catch(error => console.error("Problem med nätverksanslutning", error));
}