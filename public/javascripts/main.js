'use strict';
function main () {
  // utility function
  function addMarker (map, location, title) {
    const markerOptions = {
      position: location,
      title: title
    };
    const myMarker = new google.maps.Marker(markerOptions);
    myMarker.setMap(map);
  }

  // BUILD THE MAP

  const container = document.getElementById('map');

  const options = {
    zoom: 12
  };

  const map = new google.maps.Map(container, options);

  axios.get(`${window.location.pathname}/json`)
    .then((response) => {
      let eventPin = {
        location: {
          lat: response.data.location.coordinates[1],
          lng: response.data.location.coordinates[0]
        },
        title: response.data.name
      };
      addMarker(map, eventPin.location, eventPin.title);
      map.setCenter(eventPin.location);
    });
}

window.addEventListener('load', main);
