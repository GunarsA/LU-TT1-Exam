function validateMovie(movie) {
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

async function generateForm() {
  await fetch("./data.json")
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      const genreList = data.genres.sort();
      const genreContainer = document.querySelector("#genreContainer");

      for (const i of genreList) {
        genreContainer.innerHTML += `<li class="form-check col">
        <input class="form-check-input genreInput" type="checkbox" value="${i}" id="${i}Check">
        <label class="form-check-label" for="${i}Check">
          ${i}
        </label>
      </li>`;
      }
    });
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
          movieListContainer.innerHTML += `<div class="card col m-3 p-3 border-primary">
            <img src="${i.posterUrl}" class="card-img-top rounded" alt="...">
            <div class="card-body">
                <h5 class="card-title">${i.title}</h5>
            </div>
        </div>`;
        }
      }
    });
}

window.addEventListener("DOMContentLoaded", (event) => {
  document.querySelector("#queryButton").onclick = () => {
    generateCards();
  };

  generateForm();
  generateCards();
});
