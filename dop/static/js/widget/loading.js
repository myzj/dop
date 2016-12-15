define('widget/loading', ["lib/common"], function($) {
    var params = {
        D_pop: $('<div class="pop_loading2"><i class="spin"></i></div>'),
        D_pop2: $('<div class="pop_loading2"><span>正在加载中...</span><i class="spin"></i></div></div>')
    },
    D_w = $(window),
    def="D_pop";
    /*
     * loading on(ture)调用多少次 就需要多少次的on(false) 来关闭
     * @off (true or flase)开关 true:开启 false:关闭
     * @name (string or true or false)元素在param中的对象名 或者为boolean类型作用等于 @topOn:true or false
     * @topOn (true or flase)是否开启部分显示 默认关闭，如开启默认显示为 header标签内容,其他请看 retainTop 说明
     */
    function loading(off, name, topOn) {
        var D_pop,
            _count = 0;

        /** [if 第二个参数为true时] */
        if (typeof name === 'boolean' && name) {
            name = def;
            topOn = true;
        } else {
            name = name || def;
        }
        D_pop = params[name] || false;
        /** [if 是否存在相对应的元素] */
        if (D_pop) {
            /** [if 如果第一个参数为空或字符串时，返回是否处于加载中] */
            if (typeof off === "undefined" || typeof off === "string") {
                return params[off || def].data("count") >> 0;
            } else {
                _count = D_pop.data("count") >> 0;
                if (off) {
                    D_pop.data("count", ++_count);
                    if (_count == 1) {
                        $('body').append(D_pop);
                        offTouchmove(D_pop);
                        if (topOn) {
                            retainTop(D_pop,topOn);
                        }
                    }
                } else {
                    D_pop.data("count", --_count);
                    if (_count <= 0) {
                        offLoaning(D_pop);
                        retainTop(D_pop,false);
                    }

                }
                return name;
            }
        }

    }
    // 关闭
    function offLoaning(D_pop) {
        if (typeof D_pop === "string") {
            D_pop = params[D_pop];
        } else if (typeof D_pop === "undefined") {
            D_pop = params[def];
        }
        D_pop.data("count", 0);
        D_pop.remove();
        D_w.off("scroll.loading");
    }
    /*
     * retainTop 1.默认为 header标签内容
     *           2.如设置 [data-loading-top] 元素则显示自身及以上的内容
     */
    function retainTop(D_pop,bol) {
        var D_top = $('[data-loading-top]'),
            D_top_nav=$(".top_nav");

        if (!D_top.length) {
            D_top = $("header");
        }
        
        if(bol){
            D_w.off("scroll.loading").on("scroll.loading", function() {
                var
                    _h = D_top.height() + D_top.offset().top, //
                    _top = _h - D_w.scrollTop(),
                    _lh = D_w.height() - _top;
                D_pop.css({
                    'padding-top': _top > 0 ? _top : 0
                });
            }).trigger("scroll");

            offTouchmove(D_top);
            D_top.addClass("z100");
        }else{
           D_w.off("scroll.loading");
           D_pop.css({
                    'padding-top': ""
                });
           D_top.removeClass("z100")
        }

        if(D_top_nav.length){
            if(bol){
                D_top_nav.addClass("z100");
            }else{
                D_top_nav.removeClass("z100");
            }
        }
    }
     /**
     * [offTouchmove 去除滚动事件]
     * @param  {[type]} D_e    [description]
     */
    function offTouchmove( D_e) {
        if(D_e){
            D_e.off('touchmove.preventDefault').on('touchmove.preventDefault', function() {
                event.preventDefault();
            });
        }
    };

    return {
        on: loading,
        off: offLoaning
    }
});