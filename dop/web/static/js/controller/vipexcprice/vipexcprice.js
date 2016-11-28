require(['lib/common', 'model/vipexcpriceModel/vipexcpriceModel'],
    function ($, vipexcpriceModel) {
        $.hiddenShareBtn();
        //alert("token" + window.Token );
        //addCart是否是跨级商品,   removeTpl是否清除已渲染数据
        var addFlag = true;       //加入购物车 是否高亮显示
        var pageFlag = true;  //是否允许加载下一页
        var pageIndex = 1;
        var PageSize = 5;
        var userlevel = window.UserLevel;
        var data_level = window.UserLevel;
        //获取广告模块
        $.loadModuleDate(
           { moduleCode:"A-309"},
            function(res){
                $.tplRender("tpl_vipexcpricebanner", res);
           }
        );
        //页面初始化
        if(userlevel <= 1){

            data_level = 2;
            addFlag = false;

            getData(pageIndex,data_level,addFlag,true);
        }else{
            getData(pageIndex,userlevel,addFlag,true);
        }
        function getData(pageIndex,data_level,addCart,removeTpl){

            pageFlag = false;
            $.loading(false);
            var datainfo = {
                post:{
                    "PageIndex":pageIndex,
                    "PageSize":PageSize,
                    "MemberLevel":data_level
                }
            };
            
            vipexcpriceModel.getvipexcpriceList(datainfo,function(res){
                if(res.success){
                    var data = res.result;
                    if(removeTpl){
                        pageFlag = false;
                        data.data_level = data_level;
                        $('.nav_main').length > 0 ? $('.nav_main').remove():'';
                        $.tplRender("tpl_vipexcpricegrade", data);
                        $(".products_list dl").length > 0 ? $(".products_list dl").remove():'';
                    }
                    data.addCart = addCart;
                    $.tplRender("tpl_vipexcpriceContent", data);
                    bindAction();
                    if(data.QueryVipClubDiscountListDtos != null && data.QueryVipClubDiscountListDtos.length == PageSize){
                        pageFlag = true;
                        pageIndex = pageIndex + 1;
                        $('.loading_img').show();
                        $('.loading_next_page a').html('正在努力加载....');

                    }else{
                        pageFlag = false;
                        $('.loading_img').hide();
                        $('.loading_next_page a').html('已经到底了');
                    }
                    if(pageFlag){
                        page(pageIndex);
                    }
                }else{
                    alert(res.errormsg);
                }
                 $.loading(false);

            });
        }

        $(".vip_gradename").click(function () {
            $(".vip_grade").toggle();
        });
        //加入购物车
        function bindAction() {
            //会员等级对应的产品
            $(".vip_grade li").unbind().bind("click", function () {
                var pre_userlevel = $(this).attr("data-userlevel");
                data_level = $(this).attr("data-userlevel");
                $(".vip_gradename_detail").attr("data-userlevel", data_level);

                $(".vip_gradename_detail").text($(this).text());
                getData(1,pre_userlevel,addFlag,true);
            });
            $(".add_cart").unbind().bind("click", function () {
                var _this = $(this);
                var holderMsg = "";
                var level = parseInt($(".vip_gradename_detail").attr("data-userlevel"));
                if(level == 2){
                    holderMsg = "银卡";
                }else if(level == 3){
                    holderMsg = "金卡";
                }if(level == 4){
                    holderMsg = "白金卡";
                }if(level == 5){
                    holderMsg = "至尊卡";
                }
                if(_this.hasClass("disabled_add")){
                    var msg = "仅限{0}以上会员专享哦";
                    var tips = msg.replace("{0}",holderMsg);
                    $.tipsDialog({
                        "tips": tips,
                        autoCloseDialog: 3000,
                    });
                    return;
                }
                var datainfo = {
                    post:{
                        "GoodsId": _this.attr("data-skuid"),
                        "ProductType": _this.attr("data-protype"),
                        "PromoId": _this.attr("data-proid"),
                        "Quantity": _this.attr("data-qty")
                    }
                };
                $.loading(true);
                vipexcpriceModel.vipexcpriceaddcart(datainfo,function(data){
                    var res = data.result;
                    if(data.success){
                        $.iosDialog({
                            title:"",
                            tips: res.DoResult,
                            "cancelHtml":"确定"
                        });
                    }else{
                        $.iosDialog({
                            title:"",
                            tips: data.errormsg,
                            "cancelHtml":"确定"
                        });
                    }

                    $.loading(false);
                })
            });
        };


        function page(pageIndex){
            var pagesetTime = "";
            //分页
            var win = $(window);
            var banner = $(".banner").height();
            win.unbind().on('scroll', function () {
                if(pageFlag){
                    clearTimeout(pagesetTime);
                    pagesetTime = setTimeout(function () {
                        var scrollHeight = $('body').height();
                        if ($(this).height() + $(this).scrollTop() >= scrollHeight) {
                            getData(pageIndex,data_level,addFlag,false);
                        }
                    }, 1000);
                };
                //会员等级吸顶
                if (window.isMyzjApp == "True") {
                    if (win.scrollTop() >= banner) {
                        $(".vip_gradename").addClass("fixed");
                    } else {
                        $(".vip_gradename").removeClass("fixed");
                    }
                } else {
                    var wintop = $(".touchweb_header").height();
                    topfixheight = wintop + banner;
                    if (win.scrollTop() >= topfixheight) {
                        $(".vip_gradename").addClass("fixed");
                    } else {
                        $(".vip_gradename").removeClass("fixed");
                    }
                }
            });
        }


});