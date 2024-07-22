'use strict';
const navBarToggle = document.querySelector('.toggler');
const navBarAside = document.querySelector('.nav-aside');
const navLinks = document.querySelectorAll('.nav-link');
const playingPage = document.querySelector('#btn-playing');
const popularPage = document.querySelector('#btn-popular');
const topRatedPage = document.querySelector('#btn-Top-Rated');
const trendingPage = document.querySelector('#btn-Trending');
const upcomingPage = document.querySelector('#btn-Upcoming');
const contactPage = document.querySelector('#btn-contact');
const items = document.querySelector('.items');
const form = document.querySelector('form');
const name = document.querySelector('#exampleInputName');
const email = document.querySelector('#exampleInputEmail1');
const age = document.querySelector('#exampleInputAge');
const phone = document.querySelector('#exampleInputPhone');
const password = document.querySelector('#exampleInputPassword');
const confirmPassword = document.querySelector('#exampleInputConfirmPassword');
const submitBtn = document.querySelector('.btn-submit');
const message = document.querySelectorAll('.warning');
const inputs = document.querySelectorAll('.form-control');

navBarToggle.addEventListener('click', () => {
  let bars = navBarToggle.firstElementChild;
  let cancel = navBarToggle.firstElementChild.nextElementSibling;
  cancel.classList.toggle('d-none');
  bars.classList.toggle('d-none');
  navBarAside.classList.toggle('show');
  navBarAside.classList.toggle('hide');
  // start nav links animation
  navLinks.forEach((link, index) => {
    link.addEventListener('click', () => {
      navBarAside.classList.toggle('show');
      navBarAside.classList.toggle('hide');
      bars.classList.toggle('d-none');
      cancel.classList.toggle('d-none');
      navLinks.forEach((link, index) => {
        if (link.style.animation) {
          link.style.animation = '';
        } else {
          link.style.animation = `fadeIn 0.5s ease-in forwards ${index / 7 + 0.25}s`;
        }
      });
    });
    if (link.style.animation) {
      link.style.animation = '';
    } else {
      link.style.animation = `fadeIn 0.5s ease-in forwards ${index / 7 + 0.25}s`;
    }
  });
});


async function getMovies(endpoint) {
  const response = await fetch(`https://api.themoviedb.org/3/${endpoint}?api_key=9dfbcfa3d9952ed92d7cbae813c66664`);
  const data = await response.json();
  return data.results;
}

async function searchMovies(query) {
  const response = await fetch(`https://api.themoviedb.org/3/search/movie?query=${query}&api_key=9dfbcfa3d9952ed92d7cbae813c66664&include_adult=true`);
  const data = await response.json();
  return data.results;
}

const searchBox = document.querySelector('.search-box');

async function displaySearchResults(query) {

  const movies = await searchMovies(query);
  items.innerHTML = '';
  if (query === '' || query === null || query === undefined) {
    displayMovies('movie/now_playing');
  }else{
    movies.forEach(movie => {
      let movieRate = movie.vote_average;
      movieRate = movieRate.toString().slice(0, 3);
      const movieCard = document.createElement('div');
      movieCard.classList.add('movie-card');
      movieCard.innerHTML = `
    <div class="item col-md-4">
      <div class="overflow-hidden">
      <img src="https://image.tmdb.org/t/p/w500${movie.poster_path}" alt="${movie.title}">
      </div>
      <div class="text">
      <h3 class = "fs-1">${movie.title}</h3>
      <p>${movie.overview}</p>
      <p>Release Date: ${movie.release_date}</p>
      <p class='rate border border-2 border-success d-flex justify-content-center align-items-center'><span>${movieRate}</span></p>
      </div>
      </div>
      `;
      items.innerHTML += movieCard.innerHTML;
    });
  }
}

// self invoking function to display now playing movies
(async function () {
  await displayMovies('movie/now_playing');
})();

document.querySelector('.clearBtn').addEventListener('click', () => {
  searchBox.value = '';
  displayMovies('movie/now_playing');
});

searchBox.addEventListener('keyup', e => {
  if (searchBox.value === '' || searchBox.value === null || searchBox.value === undefined || e.keyCode === 13 || e.key === 'Space') {
    displayMovies('movie/now_playing');
  } else {
    displaySearchResults(searchBox.value);
  }
});

async function displayMovies(endpoint) {
  const movies = await getMovies(endpoint);
  items.innerHTML = '';
  movies.forEach(movie => {
    let movieRate = movie.vote_average;
    let movieOverview = movie.overview;
    // first 50 words of the overview
    movieOverview = movieOverview.split(' ').slice(0, 35).join(' ') + ' Read More...';
    movieRate = movieRate.toString().slice(0, 3);
    const movieCard = document.createElement('div');
    movieCard.classList.add('movie-card');
    movieCard.innerHTML = `
    <div class="item col-lg-4 col-md-6 col-sm-12 flex-grow-1">
      <div class="overflow-hidden">
        <img src="https://image.tmdb.org/t/p/w500${movie.poster_path}" alt="${movie.title}">
      </div>
      <div class="text px-4">
        <h3 class = "text-center fw-bold">${movie.title}</h3>
        <p class="my-1">${movieOverview}</p>
        <p>Release Date: ${movie.release_date}</p>
        <p class='rate border border-3 border-success d-flex justify-content-center align-items-center'><span>${movieRate}</span></p>
      </div>
    </div>
    `;
    items.innerHTML += movieCard.innerHTML;
  });
}

playingPage.addEventListener('click', () => displayMovies('movie/now_playing'));
popularPage.addEventListener('click', () => displayMovies('movie/popular'));
topRatedPage.addEventListener('click', () => displayMovies('movie/top_rated'));
upcomingPage.addEventListener('click', () => displayMovies('movie/upcoming'));
trendingPage.addEventListener('click', () => displayMovies('trending/movie/week'));

// form validation

const nameRegex = /^[a-zA-Z]{3,30}$/;
const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
const ageRegex = /^[0-9]{1,2}$/;
const phoneRegex = /^01[0-2]{9}$/;
const passwordRegex = /^[a-zA-Z0-9]{6,}$/;

function validateInput(input, regex) {
  for (let i = 0; i < inputs.length; i++) {
    if (input === inputs[i]) {
      if (!regex.test(input.value)) {
        message[i].classList.remove('d-none');
        input.classList.add('is-invalid');
      } else {
        message[i].classList.add('d-none');
        input.classList.remove('is-invalid');
      }
    }
  }
}

inputs.forEach(input => {
  input.addEventListener('keyup', () => {
    validateInput(name, nameRegex);
    validateInput(email, emailRegex);
    validateInput(age, ageRegex);
    validateInput(phone, phoneRegex);
    validateInput(input, passwordRegex);
  });
});

age.addEventListener('keypress', e => {
  if (e.keyCode < 48 || e.keyCode > 57) {
    e.preventDefault();
  }
});


confirmPassword.addEventListener('keyup', () => {
  if (password.value !== confirmPassword.value) {
    message[5].classList.remove('d-none');
    confirmPassword.classList.add('is-invalid');
  } else {
    message[5].classList.add('d-none');
    confirmPassword.classList.remove('is-invalid');
  }
});