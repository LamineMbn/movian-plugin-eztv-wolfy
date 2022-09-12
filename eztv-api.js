var service = require('movian/service');
var api = require('common-api');

var GET_TORRENTS_ENDPOINT = "/api/get-torrents"
var SEARCH_BY_NAME_ENDPOINT = "/search"

function retrieveAllTorrentsUrl(page, limit) {
    var actualLimit = limit ? limit : 10;
    return {
        url : service.eztvBaseUrl + GET_TORRENTS_ENDPOINT,
        args: {
            limit: actualLimit,
            page: page.toString()
        }
    }
}

function retrieveSearchTorrentsByQueryUrl(query) {
    var searchUrlWithParams = service.eztvBaseUrl + SEARCH_BY_NAME_ENDPOINT;
    searchUrlWithParams = searchUrlWithParams.concat("/", replaceSpaceByDash(query));
    return {url: searchUrlWithParams}
}

function retrieveSearchTorrentsByImdbIdUrl(imdbId, page, limit) {
    var actualLimit = limit ? limit : 10;
    var searchByImdbIdUrl = service.eztvBaseUrl + GET_TORRENTS_ENDPOINT;
    var args = {
        imdb_id: imdbId,
        page: page.toString(),
        limit: actualLimit.toString()
    }
    return {
        url: searchByImdbIdUrl,
        args: args
    }
}

function replaceSpaceByDash(text) {
    return escape(text).replace(/%20/g, '-')
}

function checkResolutions(torrentTitle) {
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
    var params = retrieveAllTorrentsUrl(page)
    var response = api.callService(params.url, params.args)
    return JSON.parse(response)
}

exports.showExists = function (imdbId) {
    imdbId = formatImdbId(imdbId);
    var params = retrieveSearchTorrentsByImdbIdUrl(imdbId, 1, 1)
    var response = api.callService(params.url, params.args)
    var torrents = JSON.parse(response).torrents
    console.log("Torrents" + torrents)
    return torrents != null
}

exports.searchTorrentByQuery = function (query) {
    var params = retrieveSearchTorrentsByQueryUrl(query)
    return api.callService(params.url).toString()
}

exports.searchTorrentByImdbId = function (imdbId, page, opt) {
    imdbId = formatImdbId(imdbId);
    var params = retrieveSearchTorrentsByImdbIdUrl(imdbId, page)
    var response = JSON.parse(api.callService(params.url, params.args))
    return response.torrents ? response.torrents.filter(function (it) {
        return checkResolutions(it.title) &&
            it.seeds >= opt.minSeeds
    }) : []
}
