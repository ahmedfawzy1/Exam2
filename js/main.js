// Nav Menu
$(".open-close-menu").click(() => {
  if ($(".side-nav-menu").css("left") == "0px") {
    closeSideNav();
  } else {
    openSideNav();
  }
});

function closeSideNav() {
  $(".side-nav-menu").animate(
    {
      left: "-328px",
    },
    500
  );

  $(".open-close-menu").addClass("fa-align-justify");
  $(".open-close-menu").removeClass("fa-x");

  $(".links li").animate(
    {
      top: 300,
    },
    500
  );
}
closeSideNav();

function openSideNav() {
  $(".side-nav-menu").animate(
    {
      left: 0,
    },
    500
  );

  $(".open-close-menu").addClass("fa-x");
  $(".open-close-menu").removeClass("fa-align-justify");

  for (let i = 0; i < 5; i++) {
    $(".links li")
      .eq(i)
      .animate(
        {
          top: 0,
        },
        (i + 5) * 100
      );
  }
}
// Home Page
let rowData = document.getElementById("rowData");

async function getAllMeal() {
  let response = await fetch(
    `https://www.themealdb.com/api/json/v1/1/search.php?s=`
  );
  let data = await response.json();
  displayMeals(data.meals);
}

function displayMeals(data) {
  let container = "";
  for (let i = 0; i < data.length; i++) {
    container += `
      <div class="col-md-3">
          <div onclick="getMealsDetails('${data[i].idMeal}')" class="meal position-relative overflow-hidden rounded-2 cursor-pointer">
          <img class="w-100" src=${data[i].strMealThumb} class="img-fluid" alt="meal">
          <div class="meal-layer position-absolute d-flex align-items-center text-black p-2">
            <h3>${data[i].strMeal}</h3>
          </div>
          </div>
      </div>
      `;
  }
  rowData.innerHTML = container;
}

async function getMealsDetails(mealId) {
  rowData.innerHTML = "";
  searchContainer.innerHTML = "";
  let response = await fetch(
    `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealId}`
  );
  let data = await response.json();

  displayMealsDetails(data.meals);
}

function displayMealsDetails(mealDetails) {
  detailsMeal = ``;

  for (let i = 0; i < mealDetails.length; i++) {
    const integreation = getIntegreationList(mealDetails[i]);
    const tags = mealDetails[i].strTags
      ? mealDetails[i].strTags.split(",")
      : [];

    detailsMeal += `
    <div class="col-md-4">
      <img class="w-100 rounded-2" src="${
        mealDetails[i].strMealThumb
      }" alt="meal">
      <h2>${mealDetails[i].strMeal}</h2>
  </div>
  <div class="col-md-8">
      <h2>Instructions</h2>
      <p>${mealDetails[i].strInstructions}</p>
      <h3><span>Area :</span> ${mealDetails[i].strArea}</h3>
      <h3><span>Category :</span> ${mealDetails[i].strCategory}</h3>
      <h3>Recipes :</h3>
      <ul class="list-unstyled d-flex g-3 flex-wrap">
      ${integreation
        .map((steps) => `<li class="alert alert-info m-2 p-1">${steps}</li>`)
        .join(" ")}
          
      </ul>
      <h3>Tags :</h3>
      <ul class="list-unstyled d-flex g-3 flex-wrap">
      ${tags
        .map((tag) => `<li class="alert alert-danger m-2 p-1">${tag}</li>`)
        .join(" ")}
      </ul>
      <a class="btn btn-success" href="${mealDetails[i].strSource}">Source</a>
      <a class="btn btn-danger" href="${mealDetails[i].strYoutube}">Youtube</a>
  </div>
    `;
  }

  rowData.innerHTML = detailsMeal;
}

function getIntegreationList(recipeStep) {
  const integreation = [];
  for (let i = 1; i <= 20; i++) {
    const ingredient = recipeStep[`strIngredient${i}`];
    const measure = recipeStep[`strMeasure${i}`];

    if (ingredient && measure) {
      integreation.push(`${measure} ${ingredient}`);
    } else if (ingredient) {
      integreation.push(`${ingredient}`);
    }
  }
  return integreation;
}

window.onload = function () {
  getAllMeal();
};

/*----------------------------------------------------------------------*/
// Search Menu
let searchContainer = document.getElementById("searchContainer");
function showSearchInputes() {
  closeSideNav();
  searchContainer.innerHTML += `
  <div class="row py-4">
    <div class="col-md-6">
        <input oninput="searchByName(this.value)" type="text" class="form-control bg-transparent text-white"
            placeholder="Search By Name">
    </div>
    <div class="col-md-6">
        <input oninput="searchByLetter(this.value)" maxlength="1" type="text"
            class="form-control bg-transparent text-white" placeholder="Search By First Letter">
    </div>
</div>
  `;
  rowData.innerHTML = "";
}

async function searchByName(term) {
  closeSideNav();
  rowData.innerHTML = "";
  // searchContainer.innerHTML = "";
  let response = await fetch(
    `https://www.themealdb.com/api/json/v1/1/search.php?f=${term}`
  );
  let data = await response.json();
  data.meals ? displayMeals(data.meals) : displayMeals([]);
}
async function searchByLetter(term) {
  closeSideNav();
  rowData.innerHTML = "";
  let response = await fetch(
    `https://www.themealdb.com/api/json/v1/1/search.php?f=${term}`
  );
  let data = await response.json();
  data.meals ? displayMeals(data.meals) : displayMeals([]);
}
/*----------------------------------------------------------------------*/
// Category Menu
async function getCategories() {
  let response = await fetch(
    `https://www.themealdb.com/api/json/v1/1/categories.php`
  );
  let data = await response.json();

  displayCategories(data.categories);
  closeSideNav();
}

function displayCategories(data) {
  let container = "";
  for (let i = 0; i < data.length; i++) {
    container += `
      <div class="col-md-3">
          <div onclick="getCategoriesMeals('${
            data[i].strCategory
          }')" class="meal position-relative overflow-hidden rounded-2 cursor-pointer">
          <img class="w-100" src=${data[i].strCategoryThumb} alt="meal">
          <div class="meal-layer position-absolute text-center text-black p-2">
            <h3>${data[i].strCategory}</h3>
            <p>${data[i].strCategoryDescription
              .split(" ")
              .slice(0, 20)
              .join(" ")}</p>
          </div>
          </div>
      </div>
      `;
  }
  rowData.innerHTML = container;
}

async function getCategoriesMeals(category) {
  rowData.innerHTML = "";

  let response = await fetch(
    `https://www.themealdb.com/api/json/v1/1/filter.php?c=${category}`
  );
  let data = await response.json();

  displayMeals(data.meals.slice(0, 20));
}

/*----------------------------------------------------------------------*/
// Area Menu

async function getArea() {
  rowData.innerHTML = "";

  let response = await fetch(
    `https://www.themealdb.com/api/json/v1/1/list.php?a=list`
  );
  let data = await response.json();

  displayArea(data.meals);
}

function displayArea(data) {
  closeSideNav();
  let container = "";
  for (let i = 0; i < data.length; i++) {
    container += `
    <div class="col-md-3">
    <div onclick="getAreaMeals('${data[i].strArea}')" class="rounded-2 text-center cursor-pointer">
        <i class="fa-solid fa-house-laptop fa-4x"></i>
        <h3>${data[i].strArea}</h3>
    </div>
</div>
      `;
  }
  rowData.innerHTML = container;
}

async function getAreaMeals(area) {
  console.log(area);
  let response = await fetch(
    `https://www.themealdb.com/api/json/v1/1/filter.php?a=${area}`
  );
  let data = await response.json();

  console.log(data.meals);
  displayMeals(data.meals.slice(0, 20));
}

/*----------------------------------------------------------------------*/
// Ingredients Menu
async function getIngredients() {
  rowData.innerHTML = "";
  let response = await fetch(
    `https://www.themealdb.com/api/json/v1/1/list.php?i=list`
  );
  let data = await response.json();

  displayIngredients(data.meals);
}

function displayIngredients(data) {
  closeSideNav();
  let container = "";
  for (let i = 0; i < data.length; i++) {
    container += `
    <div class="col-md-3">
    <div onclick="getIngredientsMealsDetails('${data[i].strIngredient}')" class="rounded-2 text-center cursor-pointer">
        <i class="fa-solid fa-drumstick-bite fa-4x"></i>
        <h3>${data[i].strIngredient}</h3>
        <p>${data[i].strDescription}</p>
    </div>
</div>
      `;
  }
  rowData.innerHTML = container;
}

async function getIngredientsMealsDetails(ingredients) {
  rowData.innerHTML = "";
  let response = await fetch(
    `https://www.themealdb.com/api/json/v1/1/filter.php?i=${ingredients}`
  );
  let data = await response.json();

  displayMeals(data.meals.slice(0, 20));
}
/*----------------------------------------------------------------------*/
// Contacts Menu
function showContacts() {
  closeSideNav();
  rowData.innerHTML = `
  <div class="contacts min-vh-100 d-flex justify-content-center align-items-center">
    <div class="container w-75 text-center">
        <div class="row g-4">
            <div class="col-md-6">
                <input id="nameInput" oninput="inputsValidation()" type="text" class="form-control"
                    placeholder="Enter Your Name">
            </div>
        </div>
    </div>
</div>
  `;
}
