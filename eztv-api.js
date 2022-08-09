var service = require('movian/service');
var api = require('common-api');

var GET_TORRENTS_ENDPOINT = "/api/get-torrents"
var SEARCH_BY_NAME_ENDPOINT = "/search"

function retrieveAllTorrentsUrl(page, limit) {
    var actualLimit = limit ? limit : 10;
    var allTorrentsUrlWithParams = service.eztvBaseUrl + GET_TORRENTS_ENDPOINT;
    allTorrentsUrlWithParams = allTorrentsUrlWithParams.concat("?", "limit", "=", actualLimit.toString());
    allTorrentsUrlWithParams = allTorrentsUrlWithParams.concat("&", "page", "=", page.toString());
    return allTorrentsUrlWithParams
}

function retrieveSearchTorrentsByQueryUrl(query) {
    var searchUrlWithParams =  service.eztvBaseUrl + SEARCH_BY_NAME_ENDPOINT;
    searchUrlWithParams = searchUrlWithParams.concat("/", replaceSpaceByDash(query));
    return searchUrlWithParams
}

function retrieveSearchTorrentsByImdbIdUrl(imdbId, page, limit) {
    var actualLimit = limit ? limit : 10;
    var searchByImdbIdUrl =  service.eztvBaseUrl + GET_TORRENTS_ENDPOINT;
    searchByImdbIdUrl = searchByImdbIdUrl.concat("?", "imdb_id", "=", imdbId);
    searchByImdbIdUrl = searchByImdbIdUrl.concat("&", "page", "=", page.toString());
    searchByImdbIdUrl = searchByImdbIdUrl.concat("&", "limit", "=", actualLimit.toString());
    return searchByImdbIdUrl
}

function replaceSpaceByDash(text) {
    return escape(text).replace(/%20/g, '-')
}
function checkResolutions(torrentTitle){
        return torrentTitle.indexOf("720") > 0 || torrentTitle.indexOf("1080") > 0
}

// We remove the 'tt' at the beginning 
function formatImdbId(imdbId) {
    if (imdbId.indexOf("tt") === 0) {
        imdbId = imdbId.slice(2)
    }
    return imdbId;
}

exports.retrieveAllTorrents = function (page) {
    var url = retrieveAllTorrentsUrl(page)
    var response = api.callService(url)
    return JSON.parse(response)
}

exports.showExists = function (imdbId) {
    imdbId = formatImdbId(imdbId);
    var url = retrieveSearchTorrentsByImdbIdUrl(imdbId, 1,  1)
    var response = api.callService(url)
    var torrents = JSON.parse(response).torrents
    return torrents != null
}

exports.searchTorrentByQuery = function (query) {
    var url = retrieveSearchTorrentsByQueryUrl(query)
    return api.callService(url).toString()
}

exports.searchTorrentByImdbId = function (imdbId, page, opt) {
    imdbId = formatImdbId(imdbId);
    var url = retrieveSearchTorrentsByImdbIdUrl(imdbId, page)
    var response = JSON.parse(api.callService(url))
    return response.torrents ? response.torrents.filter(function (it) {
        return checkResolutions(it.title) &&
            it.seeds >= opt.minSeeds
    }) : []
}
