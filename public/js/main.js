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
      $("#movieDetails").append(movieDetailsHtml(details));
    });

    movieDetails.show();
    return;
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

const movieDetailsHtml = (movieDetailsObj) => {
  const notAvailable = "N/A";

  let movieTitle;
  let moviePosterAlt;
  if (movieDetailsObj.Title) {
    movieTitle = movieDetailsObj.Title.trim();
    moviePosterAlt = `${movieTitle} Poster`;
  } else {
    movieTitle = notAvailable;
    moviePosterAlt = notAvailable;
  }

  let moviePosterSrc;
  if (movieDetailsObj.Poster && movieDetailsObj.Poster.trim() !== notAvailable) {
    moviePosterSrc = movieDetailsObj.Poster.trim();
  } else {
    moviePosterSrc = "/public/no_image.jpeg";
    moviePosterAlt = notAvailable;
  }

  let moviePlot;
  if (movieDetailsObj.Plot) {
    moviePlot = movieDetailsObj.Plot.trim();
  } else {
    moviePlot = notAvailable;
  }

  let yearReleased;
  if (movieDetailsObj.Year) {
    yearReleased = movieDetailsObj.Year.trim();
  } else {
    yearReleased = notAvailable;
  }

  let movieRating;
  if (movieDetailsObj.Rated) {
    movieRating = movieDetailsObj.Rated.trim();
  } else {
    movieRating = notAvailable;
  }

  let movieRuntime;
  if (movieDetailsObj.Runtime) {
    movieRuntime = movieDetailsObj.Runtime.trim();
  } else {
    movieRuntime = notAvailable;
  }

  let movieGenres;
  if (movieDetailsObj.Genre) {
    movieGenres = movieDetailsObj.Genre.trim();
  } else {
    movieGenres = notAvailable;
  }

  let boxOfficeEarnings;
  if (movieDetailsObj.BoxOffice) {
    boxOfficeEarnings = movieDetailsObj.BoxOffice.trim();
  } else {
    boxOfficeEarnings = notAvailable;
  }

  let dvdReleaseDate;
  if (movieDetailsObj.DVD) {
    dvdReleaseDate = movieDetailsObj.DVD.trim();
  } else {
    dvdReleaseDate = notAvailable;
  }

  let movieDirector;
  if (movieDetailsObj.Director) {
    movieDirector = movieDetailsObj.Director.trim();
  } else {
    movieDirector = notAvailable;
  }

  let movieWriter;
  if (movieDetailsObj.Writer) {
    movieWriter = movieDetailsObj.Writer.trim();
  } else {
    movieWriter = notAvailable;
  }

  let movieCast;
  if (movieDetailsObj.Actors) {
    movieCast = movieDetailsObj.Actors.trim();
  } else {
    movieCast = notAvailable;
  }

  let ratingsTableValues = "";
  if (movieDetailsObj.Ratings) {
    for (let rating of movieDetailsObj.Ratings) {
      ratingsTableValues = ratingsTableValues.concat(`
                <tr>
                    <td>${rating.Source.trim()}</td>
                    <td>${rating.Value.trim()}</td>
                </tr>`);
    }
  }

  const movieDetailsHtml = `
<article>
  <h1>${movieTitle}</h1>
  <img
    alt="${moviePosterAlt}"
    src="${moviePosterSrc}"
  />

  <h2>Plot</h2>
  <p>
    ${moviePlot}
  </p>
  <section>
    <h3>Info</h3>
    <dl>
      <dt>Year Released:</dt>
      <dd>${yearReleased}</dd>
      <dt>Rated:</dt>
      <dd>${movieRating}</dd>
      <dt>Runtime:</dt>
      <dd>${movieRuntime}</dd>
      <dt>Genre(s):</dt>
      <dd>${movieGenres}</dd>
      <dt>Box Office Earnings:</dt>
      <dd>${boxOfficeEarnings}</dd>
      <dt>DVD Release Date:</dt>
      <dd>${dvdReleaseDate}</dd>
    </dl>
  </section>

  <section>
    <h4>Cast and Crew</h4>
    <p><strong>Director:</strong> ${movieDirector}</p>
    <p><strong>Writer:</strong> ${movieWriter}</p>
    <p><strong>Cast:</strong> ${movieCast}</p>
  </section>

  <section>
    <h4>Ratings</h4>
    <table class="my_coolratings_table">
      <tr>
        <th>Source</th>
        <th>Rating</th>
      </tr>
      ${ratingsTableValues}
    </table>
  </section>
</article>
`;
  return movieDetailsHtml;
};

const validateString = (str) => {
  if (typeof str !== "string") throw "must be a string.";
  const res = str.trim();
  if (!res) throw "must not be empty.";
  return res;
};
