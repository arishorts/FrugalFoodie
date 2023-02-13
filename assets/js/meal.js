function openModal(header, img, importantBadges) {
  var modalContainer = $(".list-disc");
  modalContainer.empty();
  let importantBadgesArray = importantBadges.split(",");
  modal.style.display = "flex";
  document.getElementById("modal").classList.add("active");
  document.getElementById("modal-img").src = img;
  document.getElementById("modal-header").innerHTML = header;
  for (let i = 0; i < importantBadgesArray.length; i++) {
    let item = importantBadgesArray[i].replace(/_/g, " ");
    $(".list-disc").append("<li>" + item + "</li>");
  }
}

function closeModal() {
  document.getElementById("modal").classList.remove("active");
  modal.style.display = "none";
}

const spoonacularApp = {
  //initiate app
  init: () => {
    let currentItems = localStorage.getItem("items")
      ? JSON.parse(localStorage.getItem("items"))
      : [];
    spoonacularApp.generateMealPlan(currentItems);
  },

  generateMealPlan: async (currentItems) => {
    var mealsContainer = $("#savedMeals");
    mealsContainer.empty();
    for (let index = 0; index < currentItems.length; index += 1) {
      var item = currentItems[index];
      if (item.type == "product") {
        //spoonacularApp.generateGroceryModal();
        //GET https://api.spoonacular.com/food/products/{id}
        // Response Headers:
        // Content-Type: application/json
        data = await spoonacularApp.apiCall(`food/products/${item.id}`, "", {
          "Content-Type": "application/json",
        });
        var image = data.image;
        var title = data.title;
        var importantBadges = data.importantBadges;
        var temp = `
            <div class="bg-white p-4" data-id="${item.id}">
            <img
              src="${image}"
              class="mx-auto w-full h-auto max-h-200"
              alt="Image"
            />
            <h4 class="text-xl font-bold mt-4">${title}</h4>
            <button
              class="bg-gray-800 text-white p-2 mt-4"
              onclick="spoonacularApp.removeItem('${item.id}')"
            >
              Remove
            </button>
            <button
              class="bg-gray-800 text-white p-2 mt-4"
              onclick="openModal('${title}', '${image}', '${importantBadges}')"
            >
              Details
            </button>
          </div>`;
        mealsContainer.append(temp);
      }
      if (item.type == "recipe") {
        //GET https://api.spoonacular.com/food/products/{id}
        // Response Headers:
        // Content-Type: application/json
        data = await spoonacularApp.apiCall(
          `recipes/${item.id}/information`,
          "",
          {
            "Content-Type": "application/json",
          }
        );
        var image = data.image;
        var title = data.title;
        var temp = `  
        <div class="bg-white p-4" data-id="${item.id}">
        <img
          src="${image}"
          class="mx-auto w-full h-auto max-h-200"
          alt="Image"
        />
        <h4 class="text-xl font-bold mt-4">${title}</h4>
        <button
          class="bg-gray-800 text-white p-2 mt-4"
          onclick="spoonacularApp.removeItem('${item.id}')"
        >
        Remove
        </button>
        <button
          class="bg-gray-800 text-white p-2 mt-4"
          onclick="spoonacularApp.searchRecipeCard('${item.id}')"
        >
          Recipe
        </button>
      </div>`;
        mealsContainer.append(temp);
      }
    }
  },

  apiCall: (userRequest, queries, options) => {
    const apikey = "?apiKey=b446d78bb57f41cebb381e5061f7ca4f";
    //const apikey = "?apiKey=34d81d44cd7b469c9a2f5d3f458d078c";
    var url = `https://api.spoonacular.com/${userRequest}${queries}${apikey}`;
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

  removeItem: (id) => {
    let currentItems = localStorage.getItem("items")
      ? JSON.parse(localStorage.getItem("items"))
      : [];
    newItems = currentItems.filter((obj) => obj.id !== id);
    localStorage.setItem("items", JSON.stringify(newItems));
    $(`div[data-id='${id}']`).remove();
  },

  searchRecipeCard: async (id) => {
    const apikey = "?apiKey=b446d78bb57f41cebb381e5061f7ca4f";
    //const apikey = "?apiKey=34d81d44cd7b469c9a2f5d3f458d078c";
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

  //   generateIngredientsModal: (data) => {
  //     var modalContainer = $("#modal");
  //     modalContainer.empty();
  //     var temp = `
  //     `;
  //     modalContainer.append(temp);
  //   },

  generateGroceryModal: (data) => {
    var modalContainer = $("#modal");
    modalContainer.empty();
    var temp = `  
    <div class="modal-overlay bg-black opacity-75"></div>
      <div class="modal-container bg-white p-4 md:w-1/2 lg:w-1/3 mx-auto">
        <img id="modal-img" src="" class="h-64 mx-auto" alt="Image" />
        <h4 id="modal-header" class="text-xl font-bold mt-4"></h4>
        <ul class="list-disc pl-5 mt-4">
        </ul>
        <button
          class="bg-gray-800 text-white p-2 mt-4"
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
