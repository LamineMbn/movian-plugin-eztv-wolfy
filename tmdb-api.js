var service = require('movian/service');
var api = require('common-api');

var TMDB_IMAGE_BASE_URL = "http://image.tmdb.org/t/p/w300"
var TMDB_TV_SHOWS_ENDPOINT_PREFIX = "/tv"
var TMDB_POPULAR_SHOWS_ENDPOINT = TMDB_TV_SHOWS_ENDPOINT_PREFIX + "/popular"
var TMDB_DISCOVER_SHOWS_ENDPOINT = "/discover/tv"
var TMDB_SEARCH_SHOWS_ENDPOINT = "/search/tv"

// function retrievePopularShowsUrl(page) {
//     return {
//         url: service.tmdbBaseUrl + TMDB_POPULAR_SHOWS_ENDPOINT,
//         args: {
//             page: page.toString(),
//             api_key: service.tmdbApiKey
//         }
//     }
// }

function retrievePopularShowsUrl(page) {
    return {
        url: service.tmdbBaseUrl + TMDB_DISCOVER_SHOWS_ENDPOINT,
        args: {
            page: page.toString(),
            api_key: service.tmdbApiKey,
            sort_by: "vote_count.desc"
        }
    }
}

function retrieveShowByIdUrl(id) {
    return {
        url: service.tmdbBaseUrl + TMDB_TV_SHOWS_ENDPOINT_PREFIX + "/" + id,
        args: {
            append_to_response: "external_ids",
            api_key: service.tmdbApiKey
        }

    }
}

function retrieveSearchShowUrl(query) {
    return {
        url: service.tmdbBaseUrl + TMDB_SEARCH_SHOWS_ENDPOINT,
        args: {
            query: query.replace(" ", "+"),
            page: "1",
            api_key: service.tmdbApiKey
        }
    }
}

function retrieveEpisodeDetailUrl(tmdbId, seasonNumber, episodeNumber) {
    var episodeDetailUrl = service.tmdbBaseUrl + TMDB_TV_SHOWS_ENDPOINT_PREFIX;
    episodeDetailUrl = episodeDetailUrl.concat("/", tmdbId.toString());
    episodeDetailUrl = episodeDetailUrl.concat("/", "season");
    episodeDetailUrl = episodeDetailUrl.concat("/", seasonNumber.toString());
    episodeDetailUrl = episodeDetailUrl.concat("/", "episode");
    episodeDetailUrl = episodeDetailUrl.concat("/", episodeNumber.toString());
    return {
        url: episodeDetailUrl,
        args: {
            api_key: service.tmdbApiKey
        }
    }
}

exports.retrievePopularShows = function (fromPage){
    var params = retrievePopularShowsUrl(fromPage)
    var response = api.callService(params.url, params.args)
    return JSON.parse(response)
}

exports.retrievePoster = function (show) {
    return show.backdrop_path ? TMDB_IMAGE_BASE_URL + show.backdrop_path : 'https://ezimg.ch/s/1/9/image-unavailable.jpg'
}

exports.retrieveEpisodeScreenShot = function (episode, show) {
    return episode.still_path ? TMDB_IMAGE_BASE_URL + episode.still_path : this.retrievePoster(show)
}

exports.retrieveShowById = function(id) {
    var params = retrieveShowByIdUrl(id)
    var response = api.callService(params.url, params.args)
    return JSON.parse(response) 
}

exports.searchShow = function(query) {
    var params = retrieveSearchShowUrl(query)
    var response = api.callService(params.url, params.args)
    return JSON.parse(response)
}

exports.retrieveEpisodeDetail = function(tmbdId, seasonNumber, episodeNumber) {
    var params = retrieveEpisodeDetailUrl(tmbdId, seasonNumber, episodeNumber)
    var response = JSON.stringify("{}")
    if(seasonNumber > 0 && episodeNumber > 0){
        response = api.callService(params.url, params.args)
    }
    return JSON.parse(response)
}
