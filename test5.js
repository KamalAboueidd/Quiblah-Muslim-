const axios = require('axios');

const q = `
[out:json][timeout:25];
(
  nwr["amenity"="place_of_worship"]["religion"="muslim"](around:1000,30.0444,31.2357);
);
out center;
`;

axios.get(`https://overpass-api.de/api/interpreter?data=${encodeURIComponent(q)}`)
  .then(r => console.log('OK', r.data.elements.length))
  .catch(e => {
      console.error(e.message);
      if (e.response) {
          console.error(e.response.data);
      }
  });
