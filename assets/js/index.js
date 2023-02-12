//https://www.youtube.com/watch?v=JXi9C2EQ2qE&ab_channel=FrameworkTelevision
//https://www.youtube.com/watch?v=aFelEcWBqII&t=21s&ab_channel=CodingShiksha
//https://developer.mozilla.org/en-US/docs/Web/API/Geolocation/getCurrentPosition
//https://developers.google.com/maps/documentation/javascript/places
//http://jsfiddle.net/2crQ7/
//https://developers.google.com/maps/documentation/javascript

var map = null;
var currentInfoWindow = null;

window.initMap = initMap;

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
        map.setCenter(pos);
        currentInfoWindow = infoWindow;
        currentInfoWindow.setPosition(pos);
        currentInfoWindow.setContent("Location found.");
        currentInfoWindow.open(map);
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

function getRestaurants(pos) {
  var myLocation = new google.maps.LatLng(pos.lat, pos.lng);
  var request = {
    location: myLocation,
    radius: 500,
    query: ["grocery store near me"],
  };

  var service = new google.maps.places.PlacesService(map);
  service.textSearch(request, callback);
}

function callback(results, status) {
  if (status == google.maps.places.PlacesServiceStatus.OK) {
    for (var i = 0; i < results.length; i++) {
      var place = results[i];
      //let price = createPrice(place.price_level);
      let contentString = `
      <h3><strong>${place.name}</strong></h3>
      <h4>${place.formatted_address}</h4>
      `;
      // <p>${price}<br/>;
      //Rating : ${place.rating}
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

      google.maps.event.addListener(
        marker,
        "click",
        (function (marker, contentString, infowindow) {
          return function () {
            if (currentInfoWindow != null) {
              currentInfoWindow.close();
            }
            infowindow.open(map, marker);
            currentInfoWindow = infowindow;

            // infowindow.setContent(contentString);
            // infowindow.open(map, marker);
            // if (marker.getAnimation() !== null) {
            //   marker.setAnimation(null);
            // } else {
            //   marker.setAnimation(google.maps.Animation.BOUNCE);
            //   setTimeout(() => {
            //     marker.setAnimation(null);
            //   }, 1000);
            // }
          };
        })(marker, contentString, infowindow)
      );
    }
  }
}

// function createPrice(level) {
//   if (level != "" && level != null) {
//     let out = "";
//     for (var x = 0; x < level; x++) {
//       out += "$";
//     }
//     return out;
//   } else {
//     return "?";
//   }
// }

function addToLocalStorage(card, type) {
  let currentItems = localStorage.getItem("items")
    ? JSON.parse(localStorage.getItem("items"))
    : [];
  if (currentItems.some((obj) => obj.id === card)) return;
  currentItems.push({ id: card, type: type });
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

// ------nick add nutrients api here------
// getNutrients: () => {
//   data = spoonacularApp.apiCall();
//   spoonacularApp.showNutrients(data);
// },

// showNutrients: () => {

// },

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
    //console.log(data);
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

  searchByIngredient: async (queries) => {
    var data = await spoonacularApp.apiCall(
      "recipes/findByIngredients",
      "&ingredients=" + queries, //"pineapple,+flour,+sugar",
      {
        "Content-Type": "application/json",
      }
    );
    $("#byIngredientsInput").val("");
    spoonacularApp.showByIngredient(data);
  },

  searchRecipeCard: async (id) => {
    const apikey = "?apiKey=34d81d44cd7b469c9a2f5d3f458d078c";
    var url = `https://api.spoonacular.com/recipes/${id}/card${apikey}`;
    return fetch(url, { "Content-Type": "application/json" })
      .then((response) => response.json())
      .then((data) => {
        spoonacularApp.success(data);
        let url = data.url;
        window.open(url, "_blank");
      })
      .catch((error) => {
        spoonacularApp.fail(error);
      });
  },

  showByIngredient: (data) => {
    var searchContainer = $("#searchResults");
    searchContainer.empty();
    spoonacularApp.generateIngredientsModal();
    for (let index = 0; index < 9; index += 1) {
      var image = data[index].image;
      var title = data[index].title;
      var id = data[index].id;
      anchorEl = $("<a>");
      //anchorEl.css({ display: "block" });
      //anchorText = anchorEl.text(data.products[index].title);

      var temp = `  
      <div class="bg-gradient-to-r from-white to-gray-500 border border-black p-4">
      <img
        src="${image}"
        class="h-64 mx-auto"
        alt="Image"
      />
      <h4 class="text-xl font-bold mt-4">${title}</h4>
      <button
        class="bg-gray-800 text-white p-2 mt-4"
        onclick="addToLocalStorage('${id}','recipe')"
      >
        Add
      </button>
      <button
        class="bg-gray-800 text-white p-2 mt-4"
        onclick="spoonacularApp.searchRecipeCard('${id}')"
      >
        Recipe
      </button>
    </div>`;
      searchContainer.append(temp);
    }
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
    spoonacularApp.generateGroceryModal();
    for (let index = 0; index < 9; index += 1) {
      var image = data.products[index].image;
      var title = data.products[index].title;
      var id = data.products[index].id;
      anchorEl = $("<a>");
      //anchorEl.css({ display: "block" });
      //anchorText = anchorEl.text(data.products[index].title);

      var temp = `  
      <div class="bg-gradient-to-r from-white to-gray-500 border border-black p-4">
      <img
        src="${image}"
        class="h-64 mx-auto"
        alt="Image"
      />
      <h4 class="text-xl font-bold mt-4">${title}</h4>
      <button
        class="bg-gray-800 text-white p-2 mt-4"
        onclick="addToLocalStorage('${id}','product')"
      >
        Add
      </button>
      <button
        class="bg-gray-800 text-white p-2 mt-4"
        onclick="openModal('${title}', '${image}', 'Detail 5', 'Detail 5', 'Detail 6')"
      >
        Details
      </button>
    </div>`;
      searchContainer.append(temp);
    }
  },

  generateIngredientsModal: (data) => {
    var modalContainer = $("#modal");
    modalContainer.empty();
    var temp = `  
    <div class="modal-overlay bg-black opacity-75"></div>
      <div class="modal-container bg-white p-4 md:w-1/2 lg:w-1/3 mx-auto">
        <img id="modal-img" src="" class="h-64 mx-auto" alt="Image" />
        <h4 id="modal-header" class="text-xl font-bold mt-4"></h4>
        <ul class="list-disc pl-5 mt-4">
          <li id="modal-detail-1"></li>
          <li id="modal-detail-2"></li>
          <li id="modal-detail-3"></li>
        </ul>
        <button
          class="modal-close-button bg-gray-800 text-white p-2 mt-4"
          onclick="closeModal()"
        >
          Close
        </button>
      </div>
    `;
    modalContainer.append(temp);
  },

  generateGroceryModal: (data) => {
    var modalContainer = $("#modal");
    modalContainer.empty();
    var temp = `  
    <div class="modal-overlay bg-black opacity-75"></div>
      <div class="modal-container bg-white p-4 md:w-1/2 lg:w-1/3 mx-auto">
        <img id="modal-img" src="" class="h-64 mx-auto" alt="Image" />
        <h4 id="modal-header" class="text-xl font-bold mt-4"></h4>
        <ul class="list-disc pl-5 mt-4">
          <li id="modal-detail-1"></li>
          <li id="modal-detail-2"></li>
          <li id="modal-detail-3"></li>
        </ul>
        <button
          class="modal-close-button bg-gray-800 text-white p-2 mt-4"
          onclick="closeModal()"
        >
          Close
        </button>
      </div>
    `;
    modalContainer.append(temp);
  },
};

spoonacularApp.init();
