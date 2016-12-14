define('widget/gotoTop', ["lib/common", 'config/url'], function ($, url) {

    var returnTopTag;   //返回顶部的标签
    var returnHomeTag;  //返回首页

    /**
     * 显示或隐藏returnTop标签
     */
    function _showHideTip(){
        var scrollTop = document.body.scrollTop || document.documentElement.scrollTop;
        if(scrollTop<=0) {
            returnTopTag.hide();
            returnHomeTag.hide();
        } else {
            if (!window.IsMyzjApp) {
                returnHomeTag.show();
            }
            returnTopTag.show();
        }
    }

    /**
     * 初始化控件, 使用: gotoTop.initialize();
     * @params obj 对象参数，如{bindCls: 返回首部的"className"}
     */
    function _initialize(home) {
        if (home) {
            var _goTopHtml = '<div class="retrun_home"><a href="' + url.localloginDomain + '"></a></div><div class="return_top"><i class="icon iconfont">&#xe61a;</i></div>';
        } else {
            var _goTopHtml = '<div class="return_top"><i class="icon iconfont">&#xe61a;</i></div>';
        }
        $("body").append(_goTopHtml);
        returnTopTag = $('.return_top');
        returnHomeTag = $('.retrun_home');
        returnTopTag.on("click", function (e) {
                                goTop(e);
                                returnTopTag.hide();
                            });
        $(window).on('scroll', function(){
            _showHideTip();
        });

    }
   

	function goTop(e) {
        var event = e || event;
		event.preventDefault();
        window.scrollTo(0,0);
	}
    //绑定事件
	function init() {
		$('.J_goTop').click(function(e) {
            goTop(e);
		});
	}

	return {

		init : init,
		goTop : goTop,
        initialize: _initialize
		
	}
})