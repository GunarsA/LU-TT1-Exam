"use strict";

function integerValidator(event) {
  if (event.target.value < 0) {
    event.target.setCustomValidity("Must be a positive value!");
  } else {
    event.target.setCustomValidity("");
  }
}

function addSubmitValidation() {
  document.querySelector(".needs-validation").addEventListener(
    "submit",
    function (event) {
      event.preventDefault();
      event.stopPropagation();

      Array.from(document.querySelectorAll(".integer")).forEach((input) => {
        input.parentElement.classList.add("was-validated");

        if (input.value < 0) {
          input.setCustomValidity("Must be a positive value!");
        } else {
          input.setCustomValidity("");
        }

        input.addEventListener("input", integerValidator);
      });

      if (this.checkValidity()) {
        generateCards();
      }
    },
    false
  );
}

function addFocusOutValidation() {
  Array.from(document.querySelectorAll(".integer")).forEach((input) =>
    input.addEventListener(
      "focusout",
      function integerValidatorOuter(event) {
        event.target.parentElement.classList.add("was-validated");

        if (event.target.value < 0) {
          event.target.setCustomValidity("Must be a positive value!");
        } else {
          event.target.setCustomValidity("");
        }

        event.target.addEventListener("input", integerValidator);
      },
      { once: true }
    )
  );
}

async function generateGenreInput() {
  await fetch("./data.json")
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      const genreList = data.genres.sort();
      const genreContainer = document.querySelector("#genreContainer");

      for (const i of genreList) {
        genreContainer.innerHTML += `
        <li class="form-check col">
          <input class="form-check-input genreInput" type="checkbox" value="${i}" id="${i}Check">
          <label class="form-check-label" for="${i}Check">
          ${i}
          </label>
      </li>`;
      }
    });
}

function validateMovie(movie) {
  if (
    Number(movie.runtime) <
    Number(document.querySelector("#runtimeFloor").value)
  ) {
    return false;
  }

  if (
    Number(movie.runtime) >
    (Number(document.querySelector("#runtimeCeil").value)
      ? Number(document.querySelector("#runtimeCeil").value)
      : 1e9)
  ) {
    return false;
  }

  const genreInputs = document.querySelectorAll(".genreInput");
  const selectedGenres = [];

  for (const i of genreInputs) {
    if (i.checked) {
      selectedGenres.push(i.value);
    }
  }

  for (const i of selectedGenres) {
    if (movie.genres.includes(i)) {
      return true;
    }
  }

  return false;
}

async function generateCards() {
  await fetch("./data.json")
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      const movieList = data.movies;
      const movieListContainer = document.querySelector("#cardContainer");

      movieListContainer.innerHTML = "";

      for (const i of movieList) {
        if (validateMovie(i)) {
          const imgElement = new Image();

          imgElement.addEventListener("load", () => {
            movieListContainer.innerHTML += `
            <div class="col">
              <div class="card col p-2 border-primary">
                <img src="${i.posterUrl}" class="card-img-top rounded" alt="...">
                <div class="card-body">
                  <h5 class="card-title text-center mb-3">${i.title}</h5>
                  <p class="card-text mb-2">Year: ${i.year}</p>
                  <p class="card-text mb-2">Runtime: ${i.runtime}</p>
                  <p class="card-text mb-0">Genre(s): ${[...i.genres].join(", ")}</p>
                </div>
              </div>
            </div>`;
          });

          imgElement.src = i.posterUrl;
        }
      }
    });
}

window.addEventListener("DOMContentLoaded", (event) => {
  generateGenreInput();

  addSubmitValidation();
  addFocusOutValidation();
});
