(function ($) {
  const headerContainer = $("#headerContainer"),
    searchMovieForm = $("#searchMovieForm"),
    movie_search_term_label = $("#movie_search_term_label"),
    movie_search_term = $("#movie_search_term"),
    submitButton = $("#submitButton"),
    searchResults = $("#searchResults"),
    movieDetails = $("#movieDetails"),
    rootLink = $("#rootLink"),
    footerContainer = $("#footerContainer");

  searchMovieForm.on("submit", function (event) {
    event.preventDefault();

    movie_search_term.removeClass("inputError");

    try {
      movie_search_term.val(validateString(movie_search_term.val()));
    } catch (e) {
      movie_search_term.addClass("inputError");
      return;
    }

    movieDetails.hide();
    searchResults.empty();

    searchMovies().then(function (movieResults) {
      for (let movie of movieResults) {
        if (movie && movie.Title && movie.imdbID) {
          let a = $("<a/>")
            .addClass("searchResultsA")
            .text(movie.Title)
            .attr("href", "javascript:void(0)")
            .attr("data-id", movie.imdbID);
          let li = $("<li/>").addClass("searchResultsLi");
          li.append(a);
          $("#searchResults").append(li);
        }
      }
    });

    searchResults.show();
    return;
  });

  $(document).on("click", ".searchResultsA", function (event) {
    event.preventDefault();

    searchResults.hide();
    movieDetails.empty();

    const movieId = $(this).attr("data-id");
    getMovie(movieId).then(function (details) {
      console.log(details);
    });
  });

  async function searchMovies() {
    const reqConfig = {
      method: "GET",
      url: `https://www.omdbapi.com/?apikey=CS546&s=${$(
        "#movie_search_term"
      ).val()}`,
    };

    let movieResults = [];
    try {
      const firstPage = await $.ajax(reqConfig);
      if (firstPage && firstPage.Response) {
        movieResults = movieResults.concat(firstPage.Search);

        if (Number.parseInt(firstPage.totalResults) > 10) {
          reqConfig.url += "&page=2";
          const secondPage = await $.ajax(reqConfig);
          if (secondPage && secondPage.Response) {
            movieResults = movieResults.concat(secondPage.Search);
          }
        }
      }
    } catch (e) {
      console.log("Error during AJAX request.");
    }
    return movieResults;
  }

  async function getMovie(movieId) {
    const reqConfig = {
      method: "GET",
      url: `https://www.omdbapi.com/?apikey=CS546&i=${movieId}`,
    };

    try {
      return await $.ajax(reqConfig);
    } catch (e) {
      console.log("Error during AJAX request.");
    }
  }
})(jQuery);

const validateString = (str) => {
  if (typeof str !== "string") throw "must be a string.";
  const res = str.trim();
  if (!res) throw "must not be empty.";
  return res;
};
