define('widget/tab', ["lib/common"], function($) {
    var params = {
        D_tab_adc: $("#J_tab_adc")
    };
    var _being = { //暂存数据
        D_list: [], // 当前$(z)数据
        id: '' // 当前显示id
    };
    /**
     * [offTouchmove description]
     * @param  {[type]} D_e    [description]
     * @param  {[type]} convey [description]
     * @return {[type]}        [description]
     */
    function offTouchmove(convey, D_e) {
        var _screenY = 0;
        D_e = D_e || params.D_tab_adc;

        D_e.off('touchstart.tab').on('touchstart.tab', function(event) {
            _screenY = 0;
        }).off('touchmove.preventDefault').on('touchmove.preventDefault', function() {
            event.preventDefault();
        });
        if (convey) {
            D_e.off('touchmove.tab').on('touchmove.tab', convey, function(event) {
                _screenY = _screenY || event.touches[0].screenY;
                var _z = _screenY - event.touches[0].screenY;
                _screenY = event.touches[0].screenY;
                $(this).scrollTop($(this).scrollTop() + _z);
            });
        }
    };

    function init(convey) {
        if (params.D_tab_adc.length) {
            // 绑定事件
            onEvent();

        }

    };
    /**
     * [show 显示]
     * @param  "" id [data-]
     */
    function show(id,D_e) {
        var D_tab = $('[data-tab-bk="' + id + '"]', params.D_tab_adc);
        if (D_tab.length) {
            // 判断是否点击相同
            if (_being.id === id) {
                hide(D_tab);
            } else {
                _being.id = id; //暂存id
                params.D_tab_adc.removeClass("hide");
                // 触发事件
                D_tab.trigger('tabshow',[D_tab,D_e]).removeClass("hide").siblings().addClass("hide");
                toggleTopZ(D_tab.data('z'));
            }
        }

    };

    function toggleTopZ(z) {
        var zh = 0;
        if (_being.D_list.length) {
            _being.D_list.removeClass("z_i100");
        }
        if (z) {
            _being.D_list = $(z)
            _being.D_list.each(function() {
                var D_this = $(this);
                var _top = $('body').scrollTop() - D_this.offset().top;
                var _h = D_this.height() - (_top > 0 ? _top : 0);
                zh += (_h > 0 ? _h : 0);
            }).addClass("z_i100");
        }
        params.D_tab_adc.css({
            'padding-top': zh
        })

    };
    /**
     * [hide 隐藏]
     */
    function hide(D_e) {
        params.D_tab_adc.addClass("hide").trigger('tabhide',[D_e]);
        toggleTopZ();
        _being.id = '';
    };

    /**
     * [onEvent description]
     * @return {[type]} [description]
     */
    function onEvent() {

        $("body").on('click.mask', '[data-tab]', function() {
            var D_this = $(this);
            show(D_this.data('tab'),D_this);
        });

        params.D_tab_adc.on('click.tab', function(event) {
            if ($(event.target).data('hide')) {
                hide($(event.target));
            }
        });

        offTouchmove('[data-tab-bk]');
    };

    return {
        init: init,
        hide: hide,
        show: show,
        offTouchmove: offTouchmove
    }
})