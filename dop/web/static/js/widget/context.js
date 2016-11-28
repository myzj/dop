define("widget/context", ['lib/common', "widget/appApi", "config/url"], function($, widgetAppApi, url){

    var cityCode = $.cookie.getH5("siteid"),
        edmDomain = (url.environment == 'm' || url.environment == 'preview') ? 'http://www.feiniu.com/' : 'http://www.beta1.fn/';

    function getTouchUrl(urlType, param1, param2, extparam) {

        var _url = '';
        cityCode = param2 || cityCode;
        urlType = urlType + '';

        // urlType 1 : 手机营销网页  2: 满减活动   3:分类  4：单品页  5：频道页  6：关键字 7: 首页
        switch (urlType) {
            case '1':
                _url = edmDomain + 'edm_mobile_app/' + param1 + '/' + cityCode + '/?type=h5_m';
                break;
            case '2':
                _url = 'act/xingxiao.html?campSeq=' + param1;
                break;
            case '3':
                _url = 'list/index.html?si_seq=' + param1;
                break;
            case '4':
                _url = 'detail/index.html?sm_seq=' + param1;
                break;
            case '5':
                var cityCodeId = param2 || $.cookie.getH5("siteid");
                _url = 'channel/?channelId=' + param1 + '&cityCode=' + cityCode;
                break;
            case '6':
                _url = 'list/index.html?kw=' + param1;
                break;
            case '7':
                break;
        }

        return urlType==1 ? _url : $.url.getTouchBaseUrl() + _url;

    }

    return {
        // urlType 1 : 手机营销网页  2: 满减活动   3:分类  4：单品页  5：频道页  6：关键字 7: 首页
        redirect: function(urlType, param1, param2, extparam, appId) {
            var appId = appId || widgetAppApi.getAppid(),
                isApp = appId == 1 || appId == 2 ? 1 : 0;

            var typeObj = { // 对应app的连接
                1: "activeUrl",
                2: "sellUrl",
                3: "categoryUrl",
                4: "storeUrl",
                5: "channelUrl",
                6: "searchUrl",
                7: "appHomeUrl"
            };

            if(isApp) {
                if(urlType == 1) {
                    param1 = edmDomain + 'edm_mobile_app/' + param1 + '/' + cityCode + '/';
                }
                if(urlType == 5) {
                    param1 = getTouchUrl(5, param1, param2, extparam);
                }
                widgetAppApi.goToApp(typeObj[contentType], param1);
            } else {
                var _touchUrl = getTouchUrl(urlType, param1, param2, extparam);
                $.url.redirect(_touchUrl);
            }

        }
    }
})