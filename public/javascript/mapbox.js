mapboxgl.accessToken = 'pk.eyJ1IjoiZm9uenppNzkxIiwiYSI6ImNscm5lMHBjaTEzeWcya29jMTFlejJkNGcifQ.ltmAef2AuImAXATSxHBvyQ';
const map = new mapboxgl.Map({
container: 'map', // container ID
center: results.geometry.coordinates, // starting position [lng, lat]
zoom: 9 // starting zoom
});

new mapboxgl.Marker()
.setLngLat(results.geometry.coordinates)
.setPopup(
    new mapboxgl.Popup({offset: 10})
    .setHTML(
        `<h4>${results.title}</h4> <p>${results.location}</p>`
    )
)
.addTo(map);