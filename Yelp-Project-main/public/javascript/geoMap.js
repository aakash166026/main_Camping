
mapboxgl.accessToken = map_token;
const map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/streets-v9',
    projection: 'globe', // Display the map as a globe, since satellite-v9 defaults to Mercator
    zoom: 6,
    center: [78.476681027237, 22.1991660760527],
    mode: 'no-cors'
});
