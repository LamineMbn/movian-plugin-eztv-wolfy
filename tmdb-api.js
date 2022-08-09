var service = require('movian/service');
var api = require('common-api');

var TMDB_POSTER_BASE_URL = "http://image.tmdb.org/t/p/w300"
var TMDB_TV_SHOWS_ENDPOINT_PREFIX = "/tv"
var TMDB_POPULAR_SHOWS_ENDPOINT = TMDB_TV_SHOWS_ENDPOINT_PREFIX + "/popular"
var TMDB_SEARCH_SHOWS_ENDPOINT = "/search/tv"

function retrievePopularShowsUrl(page) {
    var popularShowsUrlWithParams = service.tmdbBaseUrl + TMDB_POPULAR_SHOWS_ENDPOINT;
    popularShowsUrlWithParams = popularShowsUrlWithParams.concat("?", "page", "=", page.toString());
    popularShowsUrlWithParams = popularShowsUrlWithParams.concat("&", "api_key", "=", service.tmdbApiKey);
    return popularShowsUrlWithParams
}

function retrieveShowByIdUrl(id) {
    var showByIdUrl = service.tmdbBaseUrl + TMDB_TV_SHOWS_ENDPOINT_PREFIX + "/" + id;
    showByIdUrl = showByIdUrl.concat("?", "append_to_response", "=", "external_ids");
    showByIdUrl = showByIdUrl.concat("&", "api_key", "=", service.tmdbApiKey);
    return showByIdUrl;
}

function retrieveSearchShowUrl(query) {
    var searchShowUrl = service.tmdbBaseUrl + TMDB_SEARCH_SHOWS_ENDPOINT;
    searchShowUrl = searchShowUrl.concat("?", "query", "=", query.replace(" ", "+"));
    searchShowUrl = searchShowUrl.concat("&", "page", "=", "1");
    searchShowUrl = searchShowUrl.concat("&", "api_key", "=", service.tmdbApiKey);
    return searchShowUrl;
}

exports.retrievePopularShows = function (fromPage){
    var url = retrievePopularShowsUrl(fromPage)
    var response = api.callService(url)
    return JSON.parse(response)
}

exports.retrievePoster = function (show) {
    return show.backdrop_path ? TMDB_POSTER_BASE_URL + show.backdrop_path : 'https://ezimg.ch/s/1/9/image-unavailable.jpg'
}

exports.retrieveShowById = function(id) {
    var url = retrieveShowByIdUrl(id)
    var response = api.callService(url)
    return JSON.parse(response) 
}

exports.searchShow = function(query) {
    var url = retrieveSearchShowUrl(query)
    var response = api.callService(url)
    return JSON.parse(response)
}
