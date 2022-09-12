var page = require('movian/page');
var http = require('movian/http');

exports.callService = function (url, args) {
    page.loading = true;
    var response = http.request(url, {
        args: args,
        noFail: true
    }).toString();
    page.loading = false;
    return response
}
