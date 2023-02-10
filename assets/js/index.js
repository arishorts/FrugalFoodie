//https://www.youtube.com/watch?v=JXi9C2EQ2qE&ab_channel=FrameworkTelevision
//https://www.youtube.com/watch?v=aFelEcWBqII&t=21s&ab_channel=CodingShiksha
//https://developer.mozilla.org/en-US/docs/Web/API/Geolocation/getCurrentPosition
//https://developers.google.com/maps/documentation/javascript/places
//http://jsfiddle.net/2crQ7/
//https://developers.google.com/maps/documentation/javascript

var map = null;
var service;
var pos;
var infoWindow;
var markers = [];

// function positionFail(err) {
//   if (err.code == 1) {
//     alert("Error: Access is denied!");
//   } else if (err.code == 2) {
//     alert("Error: Position is unavailable!");
//   }
// }

// function initMap() {
//   let position = new Object();
//   // const infoWindow = new google.maps.InfoWindow();
//   navigator.geolocation.getCurrentPosition((pos) => {
//     position.lat = pos.coords.latitude;
//     position.lng = pos.coords.longitude;
//     map = new google.maps.Map(document.getElementById("map"), {
//       center: { lat: position.lat, lng: position.lng },
//       zoom: 15,
//     });
//     // infoWindow.setPosition(position);
//     // infoWindow.setContent("Location found.");
//     // infoWindow.open(map);
//     getRestaurants(position);
//   }, positionFail);
// }

function initMap() {
  // Try HTML5 geolocation.
  map = new google.maps.Map(document.getElementById("map"), {
    center: { lat: 28.3772, lng: -81.563873 },
    zoom: 13,
  });

  infoWindow = new google.maps.InfoWindow();

  // const locationButton = document.createElement("button");
  // locationButton.textContent = "Pan to Current Location";
  // locationButton.classList.add("custom-map-control-button");
  // map.controls[google.maps.ControlPosition.TOP_CENTER].push(locationButton);

  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        pos = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };

        // infoWindow.setPosition(pos);
        // infoWindow.setContent("Location found.");
        // infoWindow.open(map);
        map.setCenter(pos);
        getRestaurants(pos);
      },
      () => {
        handleLocationError(true, infoWindow, map.getCenter());
      }
    );
  } else {
    // Browser doesn't support Geolocation
    handleLocationError(false, infoWindow, map.getCenter());
  }

  // locationButton.addEventListener("click", () => {
  //   // Try HTML5 geolocation.
  //   infoWindow.setPosition(pos);
  //   infoWindow.setContent("Location found.");
  //   infoWindow.open(map);
  //   map.setCenter(pos);
  //   getRestaurants(pos);
  // });

  // -----------------BUGFIX HOW TO CLOSE INFOWINDOWS------------------------
  // // create event listener for the marker
  // google.maps.event.addListener (marker0, 'click', function() {
  //   // and here it comes:
  //   // check if there is already an InfoWindow displayed
  //   (currentInfoWindow is not null). if yes, close it
  //   if (currentInfoWindow != null) { currentInfoWindow.close(); }
  //   // show new info window
  //   infowindow0.open(map, marker0);
  //   // store the now displayed info window in global var
  //   currentInfoWindow
  //   currentInfoWindow = infowindow0;
  //   });

  // infoWindow.addListener("closeclick", () => {
  //   // Handle focus manually.
  // });

  // google.maps.event.addListener(map, "click", function () {
  //   if (infoWindow != null) {
  //     infoWindow.close();
  //   }
  // });
  // -----------------BUGFIX HOW TO CLOSE INFOWINDOWS------------------------
}

function handleLocationError(browserHasGeolocation, infoWindow, pos) {
  infoWindow.setPosition(pos);
  infoWindow.setContent(
    browserHasGeolocation
      ? "Error: The Geolocation service failed."
      : "Error: Your browser doesn't support geolocation."
  );
  infoWindow.open(map);
}

window.initMap = initMap;

function getRestaurants(pos) {
  var myLocation = new google.maps.LatLng(pos.lat, pos.lng);
  var request = {
    location: myLocation,
    radius: 500,
    query: ["grocery store near me"],
  };

  service = new google.maps.places.PlacesService(map);
  service.textSearch(request, callback);
}

function callback(results, status) {
  console.log(results);
  if (status == google.maps.places.PlacesServiceStatus.OK) {
    for (var i = 0; i < results.length; i++) {
      var place = results[i];
      let price = createPrice(place.price_level);
      let contentString = `
      <h3>${place.name}</h3>
      <p>${price}<br/>`;
      // <h4>${place.vicinity}</h4>
      //Rating : ${place.rating}`
      //createMarker(results[i]);

      var infowindow = new google.maps.InfoWindow({
        content: contentString,
      });

      var marker = new google.maps.Marker({
        map,
        animation: google.maps.Animation.DROP,
        position: place.geometry.location,
        title: place.name,
      });

      markers[i] = {
        content: contentString,
        marker: marker,
      };

      google.maps.event.addListener(
        marker,
        "click",
        (function (marker, contentString, infowindow) {
          return function () {
            infowindow.setContent(contentString);
            infowindow.open(map, marker);
            if (marker.getAnimation() !== null) {
              marker.setAnimation(null);
            } else {
              marker.setAnimation(google.maps.Animation.BOUNCE);
              setTimeout(() => {
                marker.setAnimation(null);
              }, 1000);
            }
          };
        })(marker, contentString, infowindow)
      );

      // google.maps.event.addListener(marker, "click", () => {
      //   //infowindow.setContent(contentString);
      //   // infowindow.open(map, this);
      //   infowindow.open({
      //     anchor: marker,
      //     map,
      //   });
      // });

      //marker.setMap(map);
    }
    console.log(markers);
  }
}

// function createMarker(place) {
//   if (!place.geometry || !place.geometry.location) return;

//   const marker = new google.maps.Marker({
//     map: map,
//     position: place.geometry.location,
//     title: place.name,
//   });

// function bindInfoWindow(marker, map, infowindow, html) {
//   marker.addListener("click", () => {
//     console.log("hello1");
//     infowindow.setContent(html);
//     infowindow.open(map, this);
//   });
// }

function createPrice(level) {
  if (level != "" && level != null) {
    let out = "";
    for (var x = 0; x < level; x++) {
      out += "$";
    }
    return out;
  } else {
    return "?";
  }
}

function addToLocalStorage(card) {
  let currentItems = localStorage.getItem("items")
    ? JSON.parse(localStorage.getItem("items"))
    : [];
  currentItems.push(card);
  localStorage.setItem("items", JSON.stringify(currentItems));
}
function openModal(header, img, detail1, detail2, detail3) {
  modal.style.display = "flex";
  document.getElementById("modal").classList.add("active");
  document.getElementById("modal-img").src = img;
  document.getElementById("modal-header").innerHTML = header;
  document.getElementById("modal-detail-1").innerHTML = detail1;
  document.getElementById("modal-detail-2").innerHTML = detail2;
  document.getElementById("modal-detail-3").innerHTML = detail3;
}
function closeModal() {
  document.getElementById("modal").classList.remove("active");
  modal.style.display = "none";
}

const spoonacularApp = {
  //initiate app
  init: () => {
    $("#byIngredientsForm").submit((event) => {
      event.preventDefault();
      spoonacularApp.validateByIngredients();
    });
    $("#searchGroceryProductForm").submit((event) => {
      event.preventDefault();
      spoonacularApp.validateGroceryProduct();
    });
  },

  apiCall: (userRequest, queries, options) => {
    const apikey = "?apiKey=34d81d44cd7b469c9a2f5d3f458d078c";
    var url = `https://api.spoonacular.com/${userRequest}${apikey}${queries}`;
    //console.log(url);
    return fetch(url, options)
      .then((response) => response.json())
      .then((data) => {
        spoonacularApp.success(data);
        return data; //why isnt this returning when i set a variable
      })
      .catch((error) => {
        spoonacularApp.fail(error);
      });
  },

  success: (data) => {
    console.log(data);
  },

  fail: (error) => {
    console.log(error);
    console.log("you have an error");
  },

  validateByIngredients: () => {
    var recipeArray = $("#byIngredientsInput").val().split(",");
    var recipeString = recipeArray[0];
    for (let index = 1; index < recipeArray.length; index++) {
      recipeString = recipeString + ",+" + recipeArray[index].trim();
    }
    //console.log(recipeString);
    spoonacularApp.searchByIngredient(recipeString);
  },

  searchByIngredient: (queries) => {
    spoonacularApp.apiCall(
      "recipes/findByIngredients",
      "&ingredients=" + queries, //"pineapple,+flour,+sugar",
      {
        method: "GET",
        "Content-Type": "application/json",
      }
    );
    $("#byIngredientsInput").val("");
  },

  validateGroceryProduct: () => {
    var recipeArray = $("#searchGroceryProductInput").val().split(",");
    var recipeString = recipeArray[0];
    for (let index = 1; index < recipeArray.length; index++) {
      recipeString = recipeString + ",+" + recipeArray[index].trim();
    }
    //console.log(recipeString);
    spoonacularApp.searchGroceryProduct(recipeString);
  },

  // ------nick add nutrients api here------
  // getNutrients: () => {
  //   data = spoonacularApp.apiCall();
  //   spoonacularApp.showNutrients(data);
  // },

  // showNutrients: () => {

  // },

  searchGroceryProduct: async (queries) => {
    var data = await spoonacularApp.apiCall(
      "food/products/search",
      "&query=" + queries, //?query=pizza
      {
        method: "GET",
        "Content-Type": "application/json",
      }
    );
    $("#searchGroceryProductInput").val("");
    // If async and await are removed from the code, the function will no longer wait for the response from the API before executing the next line of code. This means that data might not contain the expected result, and the console.log and spoonacularApp.showGroceryProducts statements might produce unexpected results or errors.

    // Instead of using await, you would need to handle the asynchronous nature of the API call using a callback function or by using the .then() method on the returned Promise.
    spoonacularApp.showGroceryProducts(data);
  },

  showGroceryProducts: (data) => {
    var searchContainer = $("#searchResults");
    searchContainer.empty();
    for (let index = 0; index < 9; index += 1) {
      var image = data.products[index].image;
      var title = data.products[index].title;
      var id = data.products[index].id;
      // var image2 = data.products[index + 1].image;
      // var title2 = data.products[index + 1].title;
      // var id2 = data.products[index + 1].id;
      anchorEl = $("<a>");
      //anchorEl.css({ display: "block" });
      //anchorText = anchorEl.text(data.products[index].title);

      var temp2 = `  
      <div class="bg-white p-4">
      <img
        src="${image}"
        class="h-64 mx-auto"
        alt="Image"
      />
      <h4 class="text-xl font-bold mt-4">${title}</h4>
      <button
        class="bg-gray-800 text-white p-2 mt-4"
        onclick="addToLocalStorage('Card 2')"
      >
        Add
      </button>
      <button
        class="bg-gray-800 text-white p-2 mt-4"
        onclick="openModal('Card 2', '${image}', 'Detail 4', 'Detail 5', 'Detail 6')"
      >
        Details
      </button>
    </div>`;

      // var temp = `
      //   <div class="row align-items-center justify-content-center">
      //   <div class="card m-2 col-5">
      //     <img src="${image}" class="card-img-top" alt="..." />
      //     <div class="card-body">
      //       <h5 class="card-title">${title}</h5>
      //       <a href="./single-item.html?repo=${id}" class="btn btn-primary">Add</a>
      //     </div>
      //   </div>

      //   <div class="card m-2 col-5">
      //     <img src="${image2}" class="card-img-top" alt="..." />
      //     <div class="card-body">
      //       <h5 class="card-title">${title2}</h5>
      //       <a href="./single-item.html?repo=${id2}" class="btn btn-primary">Add</a>
      //     </div>
      //   </div>
      //   </div>
      //   `;
      searchContainer.append(temp2);
    }
  },
};

spoonacularApp.init();
