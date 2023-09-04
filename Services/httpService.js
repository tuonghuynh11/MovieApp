import axios from "axios";
import { Movie } from "../Model/Movie";
import { Comment } from "../Model/Comment";
import { Cast } from "../Model/Cast";

const BASE_URL = "https://api.themoviedb.org/3/movie/";
const BASE_URL_SEARCH = "https://api.themoviedb.org/3/search/movie?query=";
const options = {
  method: "GET",
  headers: {
    accept: "application/json",
    Authorization:
      "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIzYThiYzY5MzBmYjQ2ZTAxYmFmZTRkNDJhOGY4OWE2NiIsInN1YiI6IjY0MWM1YTYzMjRiMzMzMDBkNzI2MDQzNiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.-6PmEyqlyAb6rgUsHzTXBopALplnBcDCJS7Al3z1v3E",
  },
};
async function getMovie(type, page = 1) {
  var moviesType = `${type}?language=en-US&page=${page}`;
  var response = await axios
    .get(BASE_URL + moviesType, options)
    .catch((error) => {});
  return response !== null ? response.data.results.slice(0, 10) : null;
}
export async function getMovieDetailById(movieId) {
  var movieId = `${movieId}?language=en-US`;
  var response = await axios
    .get(BASE_URL + movieId, options)
    .then((response) => {
      return response;
    })
    .catch((error) => {
      //console.log(error);
      return null;
    });

  return response !== null ? response.data : null;
}
export async function searchMovies(movieName) {
  var movieId = `${movieName}&include_adult=false&language=en-US&page=1`;
  var response = await axios
    .get(BASE_URL_SEARCH + movieId, options)
    .then((response) => {
      return response;
    })
    .catch((error) => {
      //console.log(error);
      return null;
    });
  // var response = await axios.get(BASE_URL_SEARCH + movieId, options);
  let movies = [];
  if (response !== null) {
    response.data.results.forEach((item, index) => {
      if (index < 10) {
        movies.push(
          new Movie(
            item.id,
            item.title,
            item.overview,
            "0",
            item.vote_average,
            item.poster_path,
            item.release_date,
            [...item?.genre_ids]
          )
        );
      }
    });
  }

  return movies;
}
export async function getNowPlayingMovies() {
  const moviesList = await getMovie("now_playing", 1).catch((error) => {});
  return moviesList;
}
export async function getPopularMovies() {
  const moviesList = await getMovie("popular", 1).catch((error) => {});
  return moviesList;
}
export async function getTopRatedMovies() {
  const moviesList = await getMovie("top_rated", 1).catch((error) => {});
  return moviesList;
}

export async function getUpcomingMovies() {
  const moviesList = await getMovie("upcoming", 1).catch((error) => {});
  return moviesList;
}
export async function getReviewsOfMovie(movieId) {
  var reviewUrl = `https://api.themoviedb.org/3/movie/${movieId}/reviews?language=en-US&page=1`;
  var response = await axios
    .get(reviewUrl, options)
    .then((response) => {
      return response;
    })
    .catch((error) => {
      //console.log(error);
      return null;
    });
  let reviews = [];
  if (response !== null) {
    response.data.results.forEach((movie) => {
      reviews.push(
        new Comment(
          movie.id,
          movie.author_details.username,
          movie.author_details.avatar_path,
          movie.content,
          movie.author_details.rating
        )
      );
    });
  }

  return reviews;
}
export async function getCastOfMovie(movieId) {
  var reviewUrl = `https://api.themoviedb.org/3/movie/${movieId}/credits?language=en-US`;
  var response = await axios
    .get(reviewUrl, options)
    .then((response) => {
      return response;
    })
    .catch((error) => {
      //console.log(error);
      return null;
    });
  let cast = [];
  if (response !== null) {
    response.data.cast.forEach((casts) => {
      cast.push(
        new Cast(
          casts.adult,
          casts.gender,
          casts.id,
          casts.known_for_department,
          casts.name,
          casts.original_name,
          casts.popularity,
          casts.profile_path,
          casts.cast_id,
          casts.character,
          casts.credit_id,
          casts.order
        )
      );
    });
  }

  return cast;
}
export async function getTrailerOfMovie(movieId) {
  var trailerUrl = `https://api.themoviedb.org/3/movie/${movieId}/videos?language=en-US`;
  var response = await axios
    .get(trailerUrl, options)
    .then((response) => {
      return response.data.results[0].key;
    })
    .catch((error) => {
      //console.log(error);
      return null;
    });
  return response ? response : "";
}
export async function getMovieWatchList() {
  var watchListUrl = `https://api.themoviedb.org/3/account/18490283/watchlist/movies?language=en-US&page=1&sort_by=created_at.asc`;
  var response = await axios
    .get(watchListUrl, options)
    .then((response) => {
      return response;
    })
    .catch((error) => {
      //console.log(error);
      return null;
    });
  let movies = [];
  if (response !== null) {
    response.data.results.forEach((item) => {
      movies.push(
        new Movie(
          item.id,
          item.title,
          item.overview,
          "0",
          item.vote_average,
          item.poster_path,
          item.release_date,
          [...item?.genre_ids]
        )
      );
    });
  }
  return movies;
}
export async function addMovieWatchList(movieId) {
  const option = {
    method: "POST",
    headers: {
      accept: "application/json",
      "content-type": "application/json",
      Authorization:
        "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIzYThiYzY5MzBmYjQ2ZTAxYmFmZTRkNDJhOGY4OWE2NiIsInN1YiI6IjY0MWM1YTYzMjRiMzMzMDBkNzI2MDQzNiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.-6PmEyqlyAb6rgUsHzTXBopALplnBcDCJS7Al3z1v3E",
    },
    body: JSON.stringify({
      media_type: "movie",
      media_id: movieId,
      watchlist: true,
    }),
  };
  var Url = `https://api.themoviedb.org/3/account/18490283/watchlist`;
  const response = fetch(Url, option)
    .then((response) => response.json())
    .then((response) => console.log(response))
    .catch((err) => console.error(err));
  // var response = await axios
  //   .post(Url, option)
  //   .then((response) => {
  //     return response;
  //   })
  //   .catch((error) => {
  //     console.log(error);
  //     return null;
  //   });
  return response;
}
export async function deleteMovieWatchList(movieId) {
  const option = {
    method: "POST",
    headers: {
      accept: "application/json",
      "content-type": "application/json",
      Authorization:
        "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIzYThiYzY5MzBmYjQ2ZTAxYmFmZTRkNDJhOGY4OWE2NiIsInN1YiI6IjY0MWM1YTYzMjRiMzMzMDBkNzI2MDQzNiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.-6PmEyqlyAb6rgUsHzTXBopALplnBcDCJS7Al3z1v3E",
    },
    body: JSON.stringify({
      media_type: "movie",
      media_id: movieId,
      watchlist: false,
    }),
  };
  var Url = `https://api.themoviedb.org/3/account/18490283/watchlist`;
  // var response = await axios
  //   .post(Url, option)
  //   .then((response) => {
  //     return response;
  //   })
  //   .catch((error) => {
  //     console.log(error);
  //     return null;
  //   });

  const response = fetch(Url, option)
    .then((response) => response.json())
    .then((response) => console.log(response))
    .catch((err) => console.error(err));
  return response;
}

export async function addRatingMovie(movieId, value) {
  const url = `https://api.themoviedb.org/3/movie/${movieId}/rating`;
  const options = {
    method: "POST",
    headers: {
      accept: "application/json",
      "Content-Type": "application/json;charset=utf-8",
      Authorization:
        "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIzYThiYzY5MzBmYjQ2ZTAxYmFmZTRkNDJhOGY4OWE2NiIsInN1YiI6IjY0MWM1YTYzMjRiMzMzMDBkNzI2MDQzNiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.-6PmEyqlyAb6rgUsHzTXBopALplnBcDCJS7Al3z1v3E",
    },
    body: `{"value":${value}}`,
  };

  const response = fetch(url, options)
    .then((res) => res.json())
    .then((json) => console.log(json))
    .catch((err) => console.error("error:" + err));
  return response;
}
