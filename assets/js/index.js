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

window.initMap = initMap;

function searchNearMe(lat, long, search) {
  var url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${long}%2C${lat}&radius=1500&type=${search}&key=AIzaSyAYNCDLPp5lDjmVzQk0Q3T3xDoqNyjVllY`;
  fetch(url)
    .then((res) => res.json())
    .then((data) => {
      console.log(data);
    });
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
    var searchContainer = $("#searchResultsContainer");
    searchContainer.empty();
    for (let index = 0; index < data.products.length; index += 2) {
      var image = data.products[index].image;
      var title = data.products[index].title;
      var id = data.products[index].id;
      var image2 = data.products[index + 1].image;
      var title2 = data.products[index + 1].title;
      var id2 = data.products[index + 1].id;
      anchorEl = $("<a>");
      //anchorEl.css({ display: "block" });
      //anchorText = anchorEl.text(data.products[index].title);
      var temp = `
        <div class="row align-items-center justify-content-center">
        <div class="card m-2 col-5">
          <img src="${image}" class="card-img-top" alt="..." />
          <div class="card-body">
            <h5 class="card-title">${title}</h5>
            <a href="./single-item.html?repo=${id}" class="btn btn-primary">Add</a>
          </div>
        </div>
  
        <div class="card m-2 col-5">
          <img src="${image2}" class="card-img-top" alt="..." />
          <div class="card-body">
            <h5 class="card-title">${title2}</h5>      
            <a href="./single-item.html?repo=${id2}" class="btn btn-primary">Add</a>
          </div>
        </div>
        </div>
        `;
      searchContainer.append(temp);
    }
  },
};

spoonacularApp.init();
