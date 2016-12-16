define('config/url', function () {
    var self = this;

    return (function () {
    /*
        var mkmsDomain = '//mkms.api.beta.muyingzhijia.com/';
        var buyApi = "//buy.api.beta.muyingzhijia.com/";
        var webApi = "//web.api.beta.muyingzhijia.com/";
        var imgUrl = "//img.boodoll.cn/";
        var newWebUrl = "//wap.muyingzhijia.com:8003/";*/

        var dopWebUrl = "/";
        var login = dopWebUrl + "api/req_login";
        var signUp = dopWebUrl + "new/user/";
        var req_team_list = dopWebUrl + "api/req_team_list";


        var re = {
            login:login,
            signUp:signUp,
            req_team_list: req_team_list,
        };
        return re;
    }).call(self);
})
