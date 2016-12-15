//requirejs config

var version =  window.VERSION;
var baseUrl = '/static/js';
require.config({
    waitSeconds : 2000,
    baseUrl : baseUrl,
    paths : {

    },
    urlArgs : 'v=' + version
});
