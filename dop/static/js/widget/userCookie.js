define('widget/userCookie',['lib/common'],function($) {
    var params={
        url       : $.url.getTouchBaseUrl(),
        index     : 'index.html',   // 首页
        login_url : 'login/index.html',// 登陆页
        islogin   : $.cookie.getH5("islogin") === "1" ? true : false // 是否登陆
    };
	/**
     * 判断用户是否登陆,如无参数传入则只判断是否登陆 true false
     * @gotourl 登陆后回跳链接
     * @param 各种参数
     */
	function isLogin(gotourl,param){
        var _param=$.extend({},params,param);

        if(gotourl && !_param.islogin) {
            gotourl = _param.url + gotourl;
            $.url.redirect(_param.url + _param.login_url+'?gotourl=' + encodeURIComponent(gotourl));
            return false;
        }else{
            return _param.islogin;
        }
        
	}
    /**
     * 已经登陆跳转页页面
     * @gotourl 跳转页面默认 index.html
     * @param 各种参数
     */
    function  goUrl(gotourl,param){
        var _param = $.extend({},params,param);
        gotourl = gotourl || _param.index;

        if(gotourl.indexOf(_param.url)===-1){
            gotourl=_param.url+gotourl;
        }
        if(_param.islogin){
            $.url.redirect(gotourl);
        }
    }

	return {
        isLogin : isLogin,
        goUrl   : goUrl
	}
})