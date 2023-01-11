"use strict";

function integerValidator(event) {
  if (event.target.value < 0) {
    event.target.setCustomValidity("Must be a positive value!");
  } else {
    event.target.setCustomValidity("");
  }
}

function addQueryValidation() {
  document.querySelector("#queryForm").addEventListener(
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

function addQueryFocusoutValidation() {
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

function addEmailValidation() {
  const test = document.querySelector("#emailForm");
  document.querySelector("#emailForm").addEventListener(
    "submit",
    function (event) {
      if (!this.checkValidity()) {
        event.preventDefault();
        event.stopPropagation();

        this.classList.add("was-validated");
      }
    },
    false
  );
}

async function generateGenreInput() {
  await fetch("./data.json")
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      const genreList = data.genres.sort();

      for (const i of genreList) {
        $("#genreContainer").html((j, html) => {
          return (
            html +
            `
            <li class="form-check col">
              <input class="genreInput form-check-input" type="checkbox" value="${i}" id="${i}Check">
              <label class="form-check-label" for="${i}Check">
              ${i}
              </label>
            </li>`
          );
        });
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
            const div1 = document.createElement("div");
            div1.classList.add("col");
            const div2 = document.createElement("div");
            div2.classList.add("card", "p-2", "border-primary");
            const img = document.createElement("img");
            img.src = i.posterUrl;
            img.classList.add("card-img-top", "rounded");
            img.alt = "...";
            const div3 = document.createElement("div");
            div3.classList.add("card-body");
            const h5 = document.createElement("h5");
            h5.classList.add("card-title", "text-center", "mb-3");
            h5.textContent = i.title;
            const p1 = document.createElement("p");
            p1.classList.add("card-text", "mb-2");
            p1.textContent = "Year: " + i.year;
            const p2 = document.createElement("p");
            p2.classList.add("card-text", "mb-2");
            p2.textContent = "Runtime: " + i.runtime;
            const p3 = document.createElement("p");
            p3.classList.add("card-text", "mb-0");
            p3.textContent = "Genres: " + [...i.genres].join(", ");

            div3.replaceChildren(h5, p1, p2, p3);
            div2.replaceChildren(img, div3);
            div1.replaceChildren(div2);
            movieListContainer.appendChild(div1);
          });

          imgElement.src = i.posterUrl;
        }
      }
    });
}

window.addEventListener("DOMContentLoaded", (event) => {
  addQueryValidation();
  addQueryFocusoutValidation();
  addEmailValidation();

  generateGenreInput();
});
