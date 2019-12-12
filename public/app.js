'use strict';

const searchUrl = 'https://tastedive.com/api/similar';
const API_KEY = '351163-Resembli-JOGNIVRL';

function formatQueryParams(query) {
    const queryItems = Object.keys(query).map(key => `${encodeURIComponent(query[key])}`);
    return queryItems.join('&');
}

function queryResults(query, type, maxResults) {
    let params = {
        q: query,
        type: type,
        info: 1,
        limit: maxResults,
        k: API_KEY,
    };

    const queryString = formatQueryParams(params);
    const URL = searchUrl + '?' + queryString;

    fetch(URL)
        .then(response => {
            if(response.ok) {
                return response.json();
            }
            throw new Error(response.statusText);
        })

        .then(data => displayResults(data))

        .catch(error => {
            $('.error.message').text(`Something went wrong: ${error.message}`);
        });
}

// takes search option and reveals appropriate input div
function makeSelection() {
    $('.selection').change(function() {
        let selectedId = $('option:selected, this').attr('id');

        if(selectedId == "movie") {
            $('.movie-div').removeClass('hidden');
            $('.results-div').removeClass('hidden');
            $('.artist-div').addClass('hidden');
            $('.book-div').addClass('hidden');
            $('.search-button').prop("disabled", false);
            $('.movie-title').attr("required", "required");
            $('.artist-name').removeAttr("required");
            $('.book-title').removeAttr("required");
        } else if (selectedId == "artist") {
            $('.artist-div').removeClass('hidden');
            $('.results-div').removeClass('hidden');
            $('.movie-div').addClass('hidden');
            $('.book-div').addClass('hidden');
            $('.search-button').prop("disabled", false);
            $('.artist-name').attr("required", "required");
            $('.movie-title').removeAttr("required");
            $('.book-title').removeAttr("required");
        } else if (selectedId == "book") {
            $('.book-div').removeClass('hidden');
            $('.results-div').removeClass('hidden');
            $('.movie-div').addClass('hidden');
            $('.artist-div').addClass('hidden');
            $('.search-button').prop("disabled", false);
            $('.book-title').attr("required", "required");
            $('.artist-name').removeAttr("required");
            $('.movie-title').removeAttr("required");
        }
    });
}

//renders search page
function watchLandingPage() {

}
//render error message
function errorMessage() {

}

function watchForm() {
    $('.form').submit(event => {
        event.preventDefault();
        let movieTitle = $('.movie-title').val();
        let artistName = $('.artist-name').val();
        let bookTitle = $('.book-title').val();
        let maxResults = $('.search-results').val();
        $('.results').empty;

        if(movieTitle != "") {
            let query = movieTitle;
            let type = "movies";
            queryResults(query, type, maxResults);
        } else if (artistName != "") {
            let query = artistName;
            let type = "music"
            queryResults(query, type, maxResults);
        } else if (bookTitle != "") {
            let query = bookTitle;
            let type = "books"
            queryResults(query, type, maxResults);
        } else {
            errorMessage();
        }

        $('.movie-title').val('');
        $('.artist-name').val('');
        $('.book-title').val('');
        $('.search-results').val('');
    })
}

$(function() {
    console.log('App loaded. Waiting on query');
    watchForm();
    watchLandingPage();
    makeSelection();
})