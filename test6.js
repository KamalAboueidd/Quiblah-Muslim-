const axios = require('axios');

const overpassQuery = `
[out:json][timeout:25];
(
  node["amenity"="place_of_worship"]["religion"="muslim"](around:1000,30.0444,31.2357);
  way["amenity"="place_of_worship"]["religion"="muslim"](around:1000,30.0444,31.2357);
  relation["amenity"="place_of_worship"]["religion"="muslim"](around:1000,30.0444,31.2357);
  node["building"="mosque"](around:1000,30.0444,31.2357);
  way["building"="mosque"](around:1000,30.0444,31.2357);
  relation["building"="mosque"](around:1000,30.0444,31.2357);
  node["amenity"="mosque"](around:1000,30.0444,31.2357);
  way["amenity"="mosque"](around:1000,30.0444,31.2357);
  relation["amenity"="mosque"](around:1000,30.0444,31.2357);
);
out center;
`;

axios.post('https://overpass-api.de/api/interpreter', overpassQuery, {
    headers: { 'Content-Type': 'text/plain' },
    timeout: 15000
}).then(r => console.log('OK', r.data.elements.length))
  .catch(e => console.error(e.message));
