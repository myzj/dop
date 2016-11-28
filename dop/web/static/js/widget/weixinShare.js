define("widget/weixinShare", function(){

    var _imgUrl,
        _link,
        _desc,
        _title,
        _imgWidth,
        _imgHeight,
        appid = "";

    function _shareFriend() {
        WeixinJSBridge.invoke('sendAppMessage',{
            "appid": appid,
            "img_url": _imgUrl,
            "img_width": _imgWidth,
            "img_height": _imgHeight,
            "link": _link,
            "desc": _desc,
            "title": _title
        }, function(res) {
        //_report('send_msg', res.err_msg);
        })
    }
    function _shareTimeline() {
        WeixinJSBridge.invoke('shareTimeline',{
            "img_url": _imgUrl,
            "img_width": _imgWidth,
            "img_height": _imgHeight,
            "link": _link,
            "desc": _desc,
            "title": _title
        }, function(res) {
        //_report('timeline', res.err_msg);
        });
    }
    function _shareWeibo() {
        WeixinJSBridge.invoke('shareWeibo',{
            "content": _desc,
            "url": _link
        }, function(res) {
        //_report('weibo', res.err_msg);
        });
    }

    /**
     * 绑定事件函数
     * @param {Object} handler 监听事件的tag
     * @param {String} event 事件类型
     * @param {Function} fun 事件调用的函数
     * @param {Boolean} prop 是否冒泡
     */
    function _addEventHandler(handler, event, fun, prop){

        if(!handler || !event || !fun){
            return;
        }
        var prop = prop || false;
        if(addEventListener){
            handler.addEventListener(event, fun, prop);
        }
        else{
            handler.attachEvent("on" + event, fun);
        }

    }

    // 当微信内置浏览器完成内部初始化后会触发WeixinJSBridgeReady事件。
    function _weixinJSBridgeReady(){

        try{
            _addEventHandler(document, 'WeixinJSBridgeReady', function onBridgeReady() {
                // 发送给好友
                WeixinJSBridge.on('menu:share:appmessage', function(argv){
                    _shareFriend();
                });
                // 分享到朋友圈
                WeixinJSBridge.on('menu:share:timeline', function(argv){
                    _shareTimeline();
                    });
                // 分享到微博
                WeixinJSBridge.on('menu:share:weibo', function(argv){
                    _shareWeibo();
                });
            }, false);
        }
        catch(e){

        }

    }

    /**
     * 初始化分享信息
     * @params {Object} obj 分享信息对象：{imgUrl: 分享图像的地址, link：分享的链接, desc：分享的内容, title：分享的标题,
     *                                   imgWidth：分享图片的宽度, imgHeight：分享图片的高度}
     */
    function _init(obj){

        var obj = obj || {};
        _imgUrl = obj.imgUrl || "";
        _link = obj.link || location.href;
        _desc = obj.desc || "飞牛网触屏网站";
        _title = obj.title || "飞牛网";
        _imgWidth = obj.imgWidth || "200";
        _imgHeight = obj.imgHeight || "200";
        if(typeof WeixinJSBridge == "undefined" || typeof WeixinJSBridge.invoke == "undefined"){
            setTimeout(function(){
                _weixinJSBridgeReady();
            }, 1000);
        }
        else{
            _weixinJSBridgeReady();
        }

    }

    return {
        init: _init
    }

});