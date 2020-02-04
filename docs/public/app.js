"use strict";

jQuery.ajaxPrefilter(function(options) {
  if (options.crossDomain && jQuery.support.cors) {
    options.url = "https://cors-anywhere.herokuapp.com/" + options.url;
  }
});

const searchUrl = "https://tastedive.com/api/similar";
const API_KEY = "351163-Resembli-JOGNIVRL";

function queryResults(query, type, maxResults) {
  let params = {
    q: query,
    type: type,
    info: 1,
    limit: maxResults,
    k: API_KEY
  };

  let result = $.ajax({
    url: searchUrl,
    data: params,
    dataType: "json",
    type: "GET"
  })

    .done(function(data) {
      if (data.Similar.Results.length == 0) {
        errorMessage();
        console.log("Nothing to show");
      } else {
        displayResults(data.Similar.Results, query);
      }
    })

    .fail(function(jqXHR, error, errorThrown) {
      console.log(jqXHR);
      console.log(error);
      console.log(errorThrown);
    });
}

// takes search option and reveals appropriate input div
function makeSelection() {
  $(".selection").change(function() {
    let selectedId = $("option:selected, this").attr("id");

    if (selectedId === "movie") {
      $(".movie-div").removeClass("hidden");
      $(".results-div").removeClass("hidden");
      $(".artist-div").addClass("hidden");
      $(".book-div").addClass("hidden");
      $(".search-button").prop("disabled", false);
      $(".movie-title").attr("required", "required");
      $(".artist-name").removeAttr("required");
      $(".book-title").removeAttr("required");
    } else if (selectedId === "artist") {
      $(".artist-div").removeClass("hidden");
      $(".results-div").removeClass("hidden");
      $(".movie-div").addClass("hidden");
      $(".book-div").addClass("hidden");
      $(".search-button").prop("disabled", false);
      $(".artist-name").attr("required", "required");
      $(".movie-title").removeAttr("required");
      $(".book-title").removeAttr("required");
    } else if (selectedId === "book") {
      $(".book-div").removeClass("hidden");
      $(".results-div").removeClass("hidden");
      $(".movie-div").addClass("hidden");
      $(".artist-div").addClass("hidden");
      $(".search-button").prop("disabled", false);
      $(".book-title").attr("required", "required");
      $(".artist-name").removeAttr("required");
      $(".movie-title").removeAttr("required");
    }
  });
}

//renders search page
function watchLandingPage() {
  $(".landing-button").click(event => {
    event.preventDefault();
    $(".landing-page").slideUp(1000);
    $(".container").removeClass("hidden");
    // $('.landing-page').addClass('hidden');
  });
}
function displayResults(data, query) {
  console.log(data);
  //movie results
  if (data[0].Type === "movie") {
    $(".results").append(`<h2>Movies like <u>${query}</u></h2>`);
    for (let i = 0; i < data.length; i++) {
      $(".results").append(`
            <div class="results-list "><a href="${data[i].wUrl}" target="_blank"><p class="results-title">${data[i].Name}</p></a>
            <iframe width="300" height="220" frameborder="0" allowfullscreen src="https://www.youtube.com/embed/${data[i].yID}"></iframe></div>`);
    }
  } else if (data[0].Type === "music") {
    $(".results").append(`<h2>Artists like <u>${query}</u></h2>`);
    for (let i = 0; i < data.length; i++) {
      $(".results").append(`
            <div class="results-list "><a href="${data[i].wUrl}" target="_blank"><p class="results-title">${data[i].Name}</p></a>
            <iframe width="300" height="220" frameborder="0" allowfullscreen src="https://www.youtube.com/embed/${data[i].yID}"></iframe></div>`);
    }
  } else if (data[0].Type === "book") {
    $(".results").append(`<h2>Books like <u>${query}</u></h2>`);
    for (let i = 0; i < data.length; i++) {
      $(".results").append(`
            <div class="results-list books"><a href="${data[i].wUrl}" target="_blank"><p class="results-title"><img src="https://davepatel95.github.io/Resemblance/images/book.png" alt="icon of a book" class="book-icon">${data[i].Name}</p></a>
            </div>`);
    }
  }
  $(".results").removeClass("hidden");
}

//render error message
function errorMessage() {
  $(".results").addClass("hidden");
  $(".error-message").append(
    `<p class="error">Sorry, No matching results found!</p>`
  );
}

function watchForm() {
  $(".form").submit(event => {
    event.preventDefault();
    let movieTitle = $(".movie-title").val();
    let artistName = $(".artist-name").val();
    let bookTitle = $(".book-title").val();
    let maxResults = $(".search-results").val();
    $(".results").empty();
    $(".error-message").empty();

    if (movieTitle != "") {
      let query = movieTitle;
      let type = "movies";
      queryResults(query, type, maxResults);
    } else if (artistName != "") {
      let query = artistName;
      let type = "music";
      queryResults(query, type, maxResults);
    } else if (bookTitle != "") {
      let query = bookTitle;
      let type = "books";
      queryResults(query, type, maxResults);
    } else {
      errorMessage();
    }

    $(".movie-title").val("");
    $(".artist-name").val("");
    $(".book-title").val("");
    $(".search-results").val("");
  });
}

$(function() {
  console.log("App loaded. Waiting on query");
  watchLandingPage();
  watchForm();
  makeSelection();
  $(".landing-button")
    .hide()
    .delay(2000)
    .fadeIn(1000);
});
