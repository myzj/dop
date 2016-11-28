define('widget/page', ['lib/common'],
    function($) {
        /**
         * 下拉分页显示数据
         * @param callbackExt 判断无分页的条件，必须返回TRUE或者FALSE
         * @param callback
         */
        $.pageScroll = function(callback){
            var scrollTimeout;
            $(window).on('scroll', function() {
//                if(flagNotData) {
//                    //已经无数据了
//                    return '';
//                }
                clearTimeout(scrollTimeout);
                scrollTimeout = setTimeout(function() {
                    var scrollHeight = $('body').height();
                    if ($(this).height() + $(this).scrollTop() >= scrollHeight) {
                        callback();
                    }
                }, 200);
            });
        }
    }
);
