//API = AIzaSyAYNCDLPp5lDjmVzQk0Q3T3xDoqNyjVllY
//'https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${pos.coords.longitude}%2C${pos.coords.latitude}&radius=1500&type=market&key=AIzaSyAYNCDLPp5lDjmVzQk0Q3T3xDoqNyjVllY',
// let map = null;

<script
  async
  src="https://maps.googleapis.com/maps/api/js?key=AIzaSyAYNCDLPp5lDjmVzQk0Q3T3xDoqNyjVllY&libraries=places&callback=initMap"
></script>;

// function initMap() {
//   navigator.geolocation.getCurrentPosition((pos) => {
//     // map = new google.maps.Map(document.getElementById("map"), {
//     //   center: {
//     //     lat: pos.coods.latitude,
//     //     lng: pos.coords.longitude,
//     //     zoom: 18,
//     //     mapId: "7293a2b4fe87a0c4",
//     //     mapTypeControl: false,
//     //     fullscreenControl: false,
//     //     streetViewControl: false,
//     //   },
//     // });
//     searchNearMe(pos.coords.latitude, pos.coords.longitude, "market");
//   });
// }

var map;
var service;
var infowindow;

function getCurrentPosition() {}

function initMap() {
  var sydney = new google.maps.LatLng(-33.867, 151.195);

  infowindow = new google.maps.InfoWindow();

  map = new google.maps.Map(document.getElementById("map"), {
    center: sydney,
    zoom: 15,
  });

  var request = {
    query: "Museum of Contemporary Art Australia",
    fields: ["name", "geometry"],
  };

  var service = new google.maps.places.PlacesService(map);

  service.findPlaceFromQuery(request, function (results, status) {
    if (status === google.maps.places.PlacesServiceStatus.OK) {
      for (var i = 0; i < results.length; i++) {
        createMarker(results[i]);
      }
      map.setCenter(results[0].geometry.location);
    }
  });
}

function createMarker(place) {
  if (!place.geometry || !place.geometry.location) return;

  const marker = new google.maps.Marker({
    map,
    position: place.geometry.location,
  });

  google.maps.event.addListener(marker, "click", () => {
    infowindow.setContent(place.name || "");
    infowindow.open(map);
  });
}

// window.initMap = initMap;

function searchNearMe(lat, long, search) {
  var url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${long}%2C${lat}&radius=1500&type=${search}&key=AIzaSyAYNCDLPp5lDjmVzQk0Q3T3xDoqNyjVllY`;
  fetch(url)
    .then((res) => res.json())
    .then((data) => {
      console.log(data);
    });
}

// initMap();
