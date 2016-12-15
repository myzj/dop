define('widget/alertHint', ['lib/common'], function($) {
    "use strict";
    var is_one = true;
    /**
     * [params 变量们]
     * @list {
        def:默认类型包含取消和确定按钮
     }
     * @config {
     *    def:配置对象
     * }
     */
    var params = {
        D_mask: $("#mask").length ? $("#mask") : $('<div id="mask" class="mask mask_5 hide" data-hide="true"></div>'),
        list: {
            def: $('<div class="mk_bk hide" data-mkid="def">' +
                '   <div class="mk_adc" data-set="adc"></div>' +
                '   <div class="mk_btn_bk">' +
                '       <div data-hide="true" data-set="off">取消</div>' +
                '       <div class="blue" data-set="on">确定</div>' +
                '   </div>' +
                '</div>'),
            sure: $('<div class="mk_bk hide" data-mkid="sure">' +
                '   <div class="mk_adc" data-set="adc"></div>' +
                '   <div class="mk_btn_bk">' +
                '       <div class="blue" data-set="on">确定</div>' +
                '   </div>' +
                '</div>')
        },
        config: {
            def: {
                on: function() {
                    hide();
                }
            },
            sure: 'def'
        }
    };

    function setParams(param) {
        $.extend(true, params, param);
    }
    /**
     * [init 初始化]
     * @param  {} param [配置对象]
     */
    /**
     * [init 初始化]
     * @param  {[对象]} param [配置对象]
     * @param  {[字符串]} name  [params.list中的对象 默认 def]
     * @param  {[布尔型]} bool [是否禁用config配置]
     */
    function init(param, name, bool) {
        // 判断是否第一次使用
        if (is_one) {
            is_one = false;
            // 获取页面数据
            getList();
            isExist();
            // 上面2个有一腿
            // 绑定事件
            onEvent();
            $('body').append(params.D_mask);

        }
        goConfig(param, name, bool);
    };
    /**
     * [addList 新增在params.list中的对象]
     * @param {[字符串]} name [对象名]
     * @param {[D_元素]} val  [内容]
     */
    function addList(name, val) {
        if (val) {
            params.list[name] = val;
        }
    };
    /**
     * [setList description]
     */
    function setList(param, name) {
        name = name || 'def';
        if (params.list[name]) {
            params.D_mask.append(params.list[name]);

            $.each(param, function(k, v) {
                var D_this = $('[data-set="' + k + '"]', params.list[name]);
                if (D_this.length) {
                    // [if 如果为字符串直接赋值]
                    if (typeof v === 'string') {
                        D_this.html(v)
                    } else if (typeof v === 'function') { // 如果为方法则执行方法
                        D_this.off('click.mklist').on('click.mklist', v);
                    } else if (typeof v === 'boolean') { // 如果为true or flase 显示 隐藏
                        if (v) {
                            D_this.show();
                        } else {
                            D_this.hide();
                        }

                    }
                }
            });
        }
    };
    /**
     * [hide 隐藏]
     */
    function hide() {
        params.D_mask.addClass("hide");
    };
    /**
     * [show 显示]
     * @param  "" id [data-]
     */
    function show(id) {
        var D_mkid = params.list[id || 'def'];
        if (D_mkid) {
            params.D_mask.removeClass("hide");
            D_mkid.removeClass("hide").siblings().addClass("hide");
            // setData(D_this,D_mkid);
        }
    };

    /**
     * [getConfig 获取配置对象]
     * @param  {[字符串]} id    [需要获取的配置对象 key]
     * @param  {[对象]} cache [防止死循环]
     * @return {[对象]}       [配置对象]
     */
    function getConfig(id, cache) {
        var _config = params.config[id];
        if (typeof _config === "string") {
            cache = cache || {};
            cache[id] = true;
            if (cache[_config]) {
                console.warn(id + "配置错误!");
                return {};
            } else {
                cache[_config] = true;
                return getConfig(_config, cache);
            }
        } else if (typeof _config === "object") {
            return _config;
        } else {
            return {};
        }
    };

    function goConfig(param, name, bool) {
        if (param) {
            var _config = $.extend(true, {}, (bool ? getConfig(name) : {}));
            if (typeof param === 'string') {
                $.extend(_config, {
                    adc: param
                });
            } else if (typeof param === 'object') {
                $.extend(_config, param);
            }
            setList(_config, name);
        }
    };


    function getList() {
        // 获取当前.mask页面中存在的[data-mkid]
        $('[data-mkid]', params.D_mask).each(function() {
            var D_this = $(this),
                _id = D_this.data("mkid");
            params.list[_id] = D_this;
        });
    };
    /**
     * [isExist 检查当前页面中[data-mask]元素是否在蒙版中存在,如存在配置相对应的数据]
     */
    function isExist() {
        $('[data-mask]').each(function() {
            var D_this = $(this),
                _id = D_this.data('mask'),
                _list = params.list[_id];

            if (_list) {
                setList(getConfig(_id), _id);
            } else {
                console.warn('.mask中不存在 data-mkid="' + _id + '"元素');
            }
        });
    };


    /** [setData 方法搁浅中] */
    function setData(D_raw_this, D_mkid) {
        var _param = {};
        $('[data-set]', D_mkid).each(function() {
            var D_this = $(this),
                _set = D_this.data('set'),
                _val = D_raw_this.data(_set);
            if (_val) {

            }
        })
    };
    /**
     * [onAlert 绑定基础事件]
     */
    function onEvent(param, name) {
        $("body").on('click.mask', '[data-mask]', function() {
            show($(this).data('mask'));
        });
        params.D_mask.on('click.mask', function(event) {
            if ($(event.target).data('hide')) {
                hide();
            }
        }).on("touchmove", function(event) {
            event.preventDefault();
        });

    };

    return {
        on: init,
        hide: hide,
        show: show
    }
})