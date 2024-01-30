// Nav Menu

$(document).ready(() => {
  searchByName("").then(() => {
    $(".loading-screen").fadeOut(500);
    $("body").css("visible");
  });
});

$(".open-close-menu").click(() => {
  if ($(".side-nav-menu").css("left") == "0px") {
    closeSideNav();
  } else {
    openSideNav();
  }
});

function closeSideNav() {
  let boxWidth = $(".side-nav-menu").outerWidth();
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
  closeSideNav();
  $(".inner-loading-screen").fadeOut(300);
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
  $(".inner-loading-screen").fadeIn(300);
  let response = await fetch(
    `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealId}`
  );
  let data = await response.json();

  displayMealsDetails(data.meals);
  $(".inner-loading-screen").fadeOut(300);
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
  $(".inner-loading-screen").fadeIn(300);
  term == "" ? (term = "a") : "";
  let response = await fetch(
    `https://www.themealdb.com/api/json/v1/1/search.php?f=${term}`
  );
  let data = await response.json();
  data.meals ? displayMeals(data.meals) : displayMeals([]);
  $(".inner-loading-screen").fadeOut(300);
}
async function searchByLetter(term) {
  closeSideNav();
  rowData.innerHTML = "";
  $(".inner-loading-screen").fadeIn(300);
  term == "" ? (term = "a") : "";
  let response = await fetch(
    `https://www.themealdb.com/api/json/v1/1/search.php?f=${term}`
  );
  let data = await response.json();
  data.meals ? displayMeals(data.meals) : displayMeals([]);
  $(".inner-loading-screen").fadeOut(300);
}
/*----------------------------------------------------------------------*/
// Category Menu
async function getCategories() {
  $(".inner-loading-screen").fadeIn(300);
  let response = await fetch(
    `https://www.themealdb.com/api/json/v1/1/categories.php`
  );
  let data = await response.json();

  displayCategories(data.categories);
  $(".inner-loading-screen").fadeOut(300);
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
  $(".inner-loading-screen").fadeIn(300);
  let response = await fetch(
    `https://www.themealdb.com/api/json/v1/1/filter.php?c=${category}`
  );
  let data = await response.json();

  displayMeals(data.meals.slice(0, 20));
  $(".inner-loading-screen").fadeOut(300);
}

/*----------------------------------------------------------------------*/
// Area Menu

async function getArea() {
  rowData.innerHTML = "";
  $(".inner-loading-screen").fadeIn(300);
  let response = await fetch(
    `https://www.themealdb.com/api/json/v1/1/list.php?a=list`
  );
  let data = await response.json();
  $(".inner-loading-screen").fadeOut(300);
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
  rowData.innerHTML = "";
  $(".inner-loading-screen").fadeIn(300);
  let response = await fetch(
    `https://www.themealdb.com/api/json/v1/1/filter.php?a=${area}`
  );
  let data = await response.json();

  displayMeals(data.meals.slice(0, 20));
  $(".inner-loading-screen").fadeOut(300);
}

/*----------------------------------------------------------------------*/
// Ingredients Menu
async function getIngredients() {
  rowData.innerHTML = "";
  $(".inner-loading-screen").fadeIn(300);
  let response = await fetch(
    `https://www.themealdb.com/api/json/v1/1/list.php?i=list`
  );
  let data = await response.json();

  displayIngredients(data.meals.slice(0, 20));
  $(".inner-loading-screen").fadeOut(300);
}

function truncWords(text, maxwords) {
  if (text !== undefined && text !== null) {
    const words = text.split(" ");
    let shortWords = words.slice(0, maxwords);
    return shortWords.join(" ");
  }
}

function displayIngredients(data) {
  closeSideNav();
  let container = "";
  for (let i = 0; i < data.length; i++) {
    const shortDes = truncWords(data[i].strDescription, 20);
    container += `
    <div class="col-md-3">
    <div onclick="getIngredientsMealsDetails('${data[i].strIngredient}')" class="rounded-2 text-center cursor-pointer">
        <i class="fa-solid fa-drumstick-bite fa-4x"></i>
        <h3>${data[i].strIngredient}</h3>
        <p>${shortDes}</p>
    </div>
</div>
      `;
  }
  rowData.innerHTML = container;
}

async function getIngredientsMealsDetails(ingredients) {
  rowData.innerHTML = "";
  $(".inner-loading-screen").fadeIn(300);
  let response = await fetch(
    `https://www.themealdb.com/api/json/v1/1/filter.php?i=${ingredients}`
  );
  let data = await response.json();

  displayMeals(data.meals.slice(0, 20));
  $(".inner-loading-screen").fadeOut(300);
}

/*----------------------------------------------------------------------*/
// Contacts Area
function showContacts() {
  closeSideNav();
  rowData.innerHTML = `
  <div class="contacts min-vh-100 d-flex justify-content-center align-items-center">
    <div class="container w-75 text-center">
        <div class="row g-4">
            <div class="col-md-6">
                <input id="nameInput" oninput="inputsValidation()" type="text" class="form-control"
                    placeholder="Enter Your Name">
                <div id="nameAlert" class="alert alert-danger w-100 mt-2 d-none">Special characters and numbers not allowed</div>
            </div>
            <div class="col-md-6">
                <input id="emailInput" oninput="inputsValidation()" type="email" class="form-control"
                    placeholder="Enter Your Email">
                <div id="emailAlert" class="alert alert-danger w-100 mt-2 d-none">Email not valid *exemple@yyy.zzz</div>
            </div>
            <div class="col-md-6">
                <input id="phoneInput" oninput="inputsValidation()" type="text" class="form-control"
                    placeholder="Enter Your Phone">
                <div id="phoneAlert" class="alert alert-danger w-100 mt-2 d-none">Enter valid Phone Number</div>
            </div>
            <div class="col-md-6">
                <input id="ageInput" oninput="inputsValidation()" type="number" class="form-control"
                    placeholder="Enter Your Age">
                <div id="ageAlert" class="alert alert-danger w-100 mt-2 d-none">Enter valid Age</div>
            </div>
            <div class="col-md-6">
                <input id="passwordInput" oninput="inputsValidation()" type="password" class="form-control"
                    placeholder="Enter Your Password">
                <div id="passwordAlert" class="alert alert-danger w-100 mt-2 d-none"> Enter valid password *Minimum eight characters, at least one letter and one number:*</div>
            </div>
            <div class="col-md-6">
                <input id="repasswordInput" oninput="inputsValidation()" type="password" class="form-control"
                    placeholder="Enter Your rePassword">
                <div id="repasswordAlert" class="alert alert-danger w-100 mt-2 d-none">Enter valid repassword</div>
            </div>
        </div>
      <button id="submitBtn" disabled class="btn btn-outline-danger px-2 mt-2">Submit</button>
    </div>
</div>
  `;

  submitBtn = document.getElementById("submitBtn");

  document.getElementById("nameInput").addEventListener("focus", () => {
    nameInputTouched = true;
  });
  document.getElementById("emailInput").addEventListener("focus", () => {
    emailInputTouched = true;
  });
  document.getElementById("phoneInput").addEventListener("focus", () => {
    phoneInputTouched = true;
  });
  document.getElementById("ageInput").addEventListener("focus", () => {
    ageInputTouched = true;
  });
  document.getElementById("passwordInput").addEventListener("focus", () => {
    passwordInputTouched = true;
  });
  document.getElementById("repasswordInput").addEventListener("focus", () => {
    repasswordInputTouched = true;
  });
}

let nameInputTouched = false;
let emailInputTouched = false;
let phoneInputTouched = false;
let ageInputTouched = false;
let passwordInputTouched = false;
let repasswordInputTouched = false;

function inputsValidation() {
  if (nameInputTouched) {
    if (isVailName()) {
      document
        .getElementById("nameAlert")
        .classList.replace("d-block", "d-none");
    } else {
      document
        .getElementById("nameAlert")
        .classList.replace("d-none", "d-block");
    }
  }

  if (emailInputTouched) {
    if (isVaildEmail()) {
      document
        .getElementById("emailAlert")
        .classList.replace("d-block", "d-none");
    } else {
      document
        .getElementById("emailAlert")
        .classList.replace("d-none", "d-block");
    }
  }

  if (phoneInputTouched) {
    if (isVaildPhone()) {
      document
        .getElementById("phoneAlert")
        .classList.replace("d-block", "d-none");
    } else {
      document
        .getElementById("phoneAlert")
        .classList.replace("d-none", "d-block");
    }
  }

  if (ageInputTouched) {
    if (isVaildAge()) {
      document
        .getElementById("ageAlert")
        .classList.replace("d-block", "d-none");
    } else {
      document
        .getElementById("ageAlert")
        .classList.replace("d-none", "d-block");
    }
  }

  if (passwordInputTouched) {
    if (isStrongPassword()) {
      document
        .getElementById("passwordAlert")
        .classList.replace("d-block", "d-none");
    } else {
      document
        .getElementById("passwordAlert")
        .classList.replace("d-none", "d-block");
    }
  }
  if (repasswordInputTouched) {
    if (isStrongRepassword()) {
      document
        .getElementById("repasswordAlert")
        .classList.replace("d-block", "d-none");
    } else {
      document
        .getElementById("repasswordAlert")
        .classList.replace("d-none", "d-block");
    }
  }
  if (
    isVailName() &&
    isVaildEmail() &&
    isVaildPhone() &&
    isVaildAge() &&
    isStrongPassword() &&
    isStrongRepassword()
  ) {
    submitBtn.removeAttribute("disabled");
  } else {
    submitBtn.setAttribute("disabled", true);
  }
}

// validation
function isVailName() {
  var nameRegex = /^[a-zA-Z\s]+$/;
  return nameRegex.test(document.getElementById("nameInput").value);
}

function isVaildEmail() {
  var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(document.getElementById("emailInput").value);
}

function isVaildPhone() {
  var phoneRegex = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/;
  return phoneRegex.test(document.getElementById("phoneInput").value);
}

function isVaildAge() {
  var ageRegex = /^(0?[1-9]|[1-9][0-9]|[1][1-9][1-9]|200)$/;
  return ageRegex.test(document.getElementById("ageInput").value);
}

function isStrongPassword() {
  var passwordRegex = /^(?=.*\d)(?=.*[a-z])[0-9a-zA-Z]{8,}$/;
  return passwordRegex.test(document.getElementById("passwordInput").value);
}

function isStrongRepassword() {
  return (
    document.getElementById("repasswordInput").value ==
    document.getElementById("passwordInput").value
  );
}
