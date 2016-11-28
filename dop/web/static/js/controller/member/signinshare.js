require(['lib/common'],
    function ($) {
        $("#babycoin").html($.url.getParam('babycoin') + "宝贝币");
        $("#coupon").html($.url.getParam('coupon') + "元");
        //获取广告模块
        $.loadModuleDate(
           { moduleCode:"A-307"},
            function(res){
                $.tplRender("tpl_signinsharebanner", res);
           }
        );
    }
);


//http://m.muyingzhijia.com/Activity/ActivePage?id=969




