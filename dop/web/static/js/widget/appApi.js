define("widget/appApi",['lib/common', "config/url"], function($, configUrl){

    var appApi = {};
    // 1android，2ios，3h5触屏  9微信
    function getAppid() {
           var _ua = navigator.userAgent;
           _ua = _ua.toLowerCase();
        if(navigator.userAgent.indexOf('feiniuapp') > -1){
            var userAgent = navigator.userAgent.split(' ');
            for(var i=0;i< userAgent.length ;i++){
                if(userAgent[i].indexOf('feiniuapp') > -1){
                    var yixunAgent = userAgent[i].split('/');
                    var agent = yixunAgent[1].toLowerCase();
                    if(agent == 'android'){
                        return 1;
                    }else if(agent == 'iphone'){
                        return 2;
                    }else if(agent == 'ipad'){
                        return 4;
                    }else if(agent == 'winphone'){
                        return 5;
                    }
                }
            }
        } else if ($.url.getParam('osType') && $.url.getParam('osType') != '') {
            if(_ua.match(/MicroMessenger/i) == 'micromessenger'){
                //微信
                return  9;
            }
            return $.url.getParam('osType');
        } else if(_ua.match(/MicroMessenger/i) == 'micromessenger'){
                //微信
                return  9;
        }
        return 3;
    }
    var appUrl = {
        activeUrl: "www2fn://OpenUrl?url=", //活动
        categoryUrl: "www2fn://GetSMbyCategory?si_seq=", //分类
        searchUrl: "www2fn://GetSMbyKey?keywords=",  //搜索
        storeUrl: "www2fn://GetMerchandise?sm_seq=", //卖场
        appHomeUrl: "www2fn://GoHome?refresh=", //跳转至App首页并1：刷新    0：不刷新
        sellUrl: "www2fn://Camp?campSeq=",  //行销活动
        touchDetailUrl: $.url.getTouchBaseUrl() + "detail/index.html?",  //触屏版商详
        channelUrl: "www2fn://OpenUrl?url=", //频道
        loginUrl: "www2fn://Login?url=", //登录页
        switchSiteidUrl: "www2fn://SwitchSiteidSiteName", //切换省份id和省份name
        chooseStandard: "www2fn://ChooseStandard?sm_seq=" //选择规格
    };

    function goToApp(urlType,param1, param2, extparam) {

        var param1 = param1 || "";
        if(appUrl[urlType]) {
            location.href = appUrl[urlType] + '' + param1;
        }

    }

    var appApiUrl = {
        activeUrl: "www2fn://OpenUrl", //活动 ?url=活动url
        categoryUrl: "www2fn://GetSMbyCategory", //分类 ?si_seq=分类id
        searchUrl: "www2fn://GetSMbyKey",  //搜索 ?keywords=关键字
        storeUrl: "www2fn://GetMerchandise", //卖场 ?sm_seq=卖场id
        appHomeUrl: "www2fn://GoHome", //跳转至App首页并1：刷新    0：不刷新 ?refresh=刷新或者不刷新
        sellUrl: "www2fn://Camp",  //行销活动 ?campSeq=行销活动
        touchDetailUrl: $.url.getTouchBaseUrl() + "detail/index.html",  //触屏版商详 ?
        channelUrl: "www2fn://OpenUrl", //频道 ?url=频道页url
        loginUrl: "www2fn://Login", //登录页 ?url=回到指定的url
        switchSiteidUrl: "www2fn://SwitchSiteidSiteName", //切换省份id和省份name
        chooseStandard: "www2fn://ChooseStandard" //选择规格 ?sm_seq=卖场id
    };

    function goToAppUrl(urlType, param){

        var param = param || "";
        if(!$.isNull(param)){
            param = "?" + param;
        }
        $.log("dddd",appApiUrl[urlType] + param)
        if(appApiUrl[urlType]) {
            location.href = appApiUrl[urlType] + param;
        }

    }

    //1. ios桥链接 可以多次调用
    function connectWebViewJavascriptBridge(callback, initFn) {
        var callback  = callback || function(){},
            initFn = initFn || function(data){};
        if (window.FNJSBridge) {
            callback(FNJSBridge, initFn);
        } else {
            //必须实现
            document.addEventListener('FNJavascriptBridgeReady', function() {
                callback(FNJSBridge, initFn);
            }, false);
        }
    }
    if(!window.bridgeInit) {
        window.bridgeInit = false;
    }

    //2。 桥初始化 只能调用一次
    function bridgeInit() {
        if(window.bridgeInit) {
            return '';
        }
        window.bridgeInit = true;
        //必须实现，初始化FNJSBridge对象
        bridge.init(function(message, responseCallback) {
//            log('JS got a message', message);
//            var data = { 'Javascript Responds':'Wee!' };
//            log('JS responding with', data);
            var data = {};
            responseCallback && responseCallback(data);
        })
    }

    /**
     * 获取IOS bridge
     * @param {Object} bd bridge
     * @param {Function} fn function
     */
    function getIphoneBridge(bd, fn){

        appApi.bridge = bd;
        appApi.bridge.init(fn);

    }

    /**
     * 开始App Loading
     */
    function startAppLoading(){

        appApi.bridge.callHandler("startLoading", "");

    }

    /**
     * 结束iphone Loading
     */
    function stopIphoneLoading(){

        if(!appApi.bridge){
            return ;
        }
        appApi.bridge.callHandler("stopLoading", "", function(res){
            if(!res){
                setTimeout(stopIphoneLoading, 0)
            }
        });

    }

    /**
     * 结束android Loading
     */
    function stopAndroidLoading(){

        if(!appApi.bridge){
            return ;
        }
        if(!appApi.bridge.callHandler("stopLoading", "")){
            setTimeout(stopAndroidLoading, 0);
        }

    }

    /**
     * 区分OS
     * @param {Int} osType
     * @param {Array} fnArr
     * @param {Function} initFn
     */
    function distScene(osType, fnArr, initFn){

        var fnArr = fnArr || [];
        switch(osType){
            case 1:
                appApi.bridge = window.FNJSBridge;
                appApi.startAppLoading = startAppLoading;
                appApi.stopAppLoading = stopAndroidLoading;
                appApi.switchCity = switchAndroidCity;
                break;
            case 2:
                connectWebViewJavascriptBridge(getIphoneBridge, initFn);
                appApi.startAppLoading = startAppLoading;
                appApi.stopAppLoading = stopIphoneLoading;
                appApi.switchCity = switchIphoneCity;
                break;
            case 3:
                appApi.bridge = null;
                appApi.switchCity = function(){};
                break;
            case 9:
                appApi.bridge = null;
                appApi.switchCity = function(){};
                break;
        }
        appApi.init = fnArr[osType - 1];
        appApi.goToAppUrl = goToAppUrl;
        return appApi;

    }

    /**
     * 获取url和cookie中的cookie值
     */
    function getCommonParam(){

        var token = $.url.getParam("th5_token"),
            islogin = $.url.getParam("th5_islogin"),
            siteId = $.url.getParam("th5_siteid"),
            siteName = $.url.getParam("th5_sitename"),
            time = 86400 * 365;
        if(islogin){
            $.cookie.addH5("islogin", islogin, "/", time, configUrl.cookieDomain);
        }
        if(token){
            $.cookie.addH5("token", token, "/", time, configUrl.cookieDomain);
        }
        if(siteId){
            $.cookie.addH5("siteid", siteId, "/", time, configUrl.cookieDomain);
        }
        if(siteName){
            $.cookie.addH5("sitename", siteName, "/", time, configUrl.cookieDomain);
        }

    }

    /**
     * 切换iphone city
     * @param {Object} mainData
     * @param callback
     */
    function switchIphoneCity(mainData, callback){

        var mainData = mainData || {};
        appApi.bridge.callHandler("switchCity", JSON.stringify(mainData), function(data){
            callback && callback(data);
        });

    }

    /**
     * 切换iphone city
     * @param {Object} mainData
     * @param callback
     */
    function switchAndroidCity(mainData, callback){

        var mainData = mainData || {};
        var data = appApi.bridge.callHandler("switchCity", JSON.stringify(mainData));
        callback && callback(data);

    }

    getCommonParam();

    return {
        getAppid:getAppid,
        goToApp: goToApp,
        connectWebViewJavascriptBridge: connectWebViewJavascriptBridge,
        bridgeInit:bridgeInit,
        getIphoneBridge: getIphoneBridge,
        distScene: distScene,
        getCommonParam: getCommonParam
    }

});