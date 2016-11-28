define('widget/fixed', ['lib/common'], function($) {
    var params = {
        D_w: $(window),
        D_b: $('body'),
        D_list: $("[data-fixed-top],[data-fixed-bottom]"),
        list_top: [],
        list_bottom: [],
        save: []
    };

    /**
     * 设置 变量 params
     */
    function setParam(param) {
        $.extend(params, param);
    };
    // 获取数据
    function getList() {
        params.D_list.each(function(i) {
            var _list={},
                D_this   = $(this),
                D_anchor = $("#anchor-" + i); // 锚点dom
                
            if (!D_anchor.length) {
                D_anchor = $('<div id="anchor-' + i + '"></div>');
                D_this.wrap(D_anchor);
            }
            _list = {
                D_this: D_this,
                D_anchor: D_anchor
            };

            D_anchor.css("position", "relative").height(D_this.height());

            if (D_this.data('fixed-top') >= 0) {
                params.list_top[D_this.data('fixed-top')] = _list;
            } else if (D_this.data('fixed-bottom') >= 0) {
                params.list_bottom[D_this.data('fixed-bottom')] = _list;
            }

        });
    };

    function wayAbsolute() {
        var
            _top       = params.D_w.scrollTop(),
            set_top    = 0,
            set_bottom = 0,
            _css       = {
                'position': 'absolute',
                "left": 0,
                'width': '100%',
                'max-width': '100%'
            }
        params.way = wayAbsolute;
        $.each(params.list_top, function(i, v) {
            if ((_top + set_top) > v.D_anchor.offset().top) {
                v.D_this.css($.extend({}, _css, {
                    top: _top
                }));
                set_top += v.D_this.height() >> 0;
            } else {
                v.D_this.css({
                    'position': '',
                    'top': ''
                });
            }
        });

        $.each(params.list_bottom, function(i, v) {
            var _h = v.D_this.height() >> 0;
            if ((_top + params.D_w.height() - set_bottom - _h) < v.D_anchor.offset().top || v.D_this.data('state') == "far") {
                v.D_this.css($.extend({}, _css, {
                    bottom: (v.D_anchor.offset().top - _top - params.D_w.height() + set_bottom + _h)
                }));
                set_bottom += _h;
            } else {
                v.D_this.css({
                    'position': '',
                    'bottom': ''
                });
            }
        });
    };

    function wayFixed() {
        var 
            _top       = params.D_w.scrollTop(),
            set_top    = 0,
            set_bottom = 0,
            _css       = {
                'position': 'fixed',
                "left": 0,
                'width': '100%',
                'max-width': '100%'
            };

        params.way = wayFixed;
        $.each(params.list_top, function(i, v) {
            if ((_top + set_top) > v.D_anchor.offset().top) {
                v.D_this.css($.extend({}, _css, {
                    top: set_top
                }));
                set_top += v.D_this.height() >> 0;
            } else {
                v.D_this.css({
                    'position': '',
                    'top': ''
                });
            }
        });

        $.each(params.list_bottom, function(i, v) {
            var _h = v.D_this.height() >> 0;
            if ((_top + params.D_w.height() - set_bottom - _h) < v.D_anchor.offset().top || v.D_this.data('state') == "far") {
                v.D_this.css($.extend({}, _css, {
                    bottom: set_bottom
                }));
                set_bottom += _h;
            } else {
                v.D_this.css({
                    'position': '',
                    'bottom': ''
                });
            }
        });
    };
    function iosScheme(){
        if(typeof params.way === 'function'){
            params.way=false;
            params.D_list.css({
                'position': '',
                'top':'',
                'bottom':''
            });
        }
    };
    /**
     * 绑定相对应的事件
     */
    function onFixed() {
        // 绑定窗口大小改变事件
        params.D_w.on('resize', getList).resize();
        // 绑定窗口滚动事件
        wayFixed();
        params.D_w.on('scroll.fixed', function(){
           params.way && params.way();
        });
    }

    return {
        onFixed     : onFixed,
        wayAbsolute : wayAbsolute,
        wayFixed    : wayFixed,
        iosScheme   : iosScheme
    }
})