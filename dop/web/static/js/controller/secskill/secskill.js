require(['lib/common', 'model/secskillModel/secskillModel'],
    function ($, secskillModel) {
        //页面初始化
        $.loading(true);
        initPage();
        function initPage(){
            $(".topnav,.content").remove();
            var datainfo ={
                post:{
                    channel_id :window.SourceTypeSysNo,
                    user_guid : window.UserGuid,
                    user_id :window.UserId ,
                }
            }
            secskillModel.getSecsList(datainfo,function(data){

                $.loading(false);
                $.tplRender("tpl_secsContent", data);

                //浮动顶部
                var win = $(window);
                var topheight = $(".topnav").height()
                win.unbind().on('scroll', function () {
                    if (window.isMyzjApp == "True") {
                        if (win.scrollTop() > 0) {
                            $(".topnav").addClass("fixed");
                        } else {
                            $(".topnav").removeClass("fixed");
                        }
                    } else {
                        var wintop = $(".touchweb_header").height();
                        if (win.scrollTop() >= wintop) {
                            $(".topnav").addClass("fixed");
                        } else {
                            $(".topnav").removeClass("fixed");
                        }
                    }
                });
                //分享最低价
                if(data.Mjses != null && data.Mjses.length>0)
                {

                    var prolist = data.Mjses[0];

                    var numbers = [];//定义一个空数组，存所有ProductPromPrice
                    if(prolist.MjsProducts.length>0)
                    {
                        for(var i=0;i<prolist.MjsProducts.length;i++)
                        {
                            numbers.push(prolist.MjsProducts[i].ProductPromPrice);//给数组赋值
                        }
                    }
                    var minPrice = Math.min.apply(Math,numbers);//找出数组里ProductPromPrice最小值
                    var minProduct = prolist.MjsProducts[numbers.indexOf(minPrice)];//根据最小值在数组里第几个位置，相应找出MjsProducts里第几个商品是最低价//minProduct就是最低价的商品对象

                    if(minProduct != null && minProduct.ProductPicUrl != null){
                        var ProductPicUrl= minProduct.ProductPicUrl;//图片地址
                        if (ProductPicUrl.indexOf("{0}") > -1 && ProductPicUrl.indexOf("{type}") <= -1) {
                            ProductPicUrl = ProductPicUrl.replace("{0}", "big");
                        } else{
                            ProductPicUrl = ProductPicUrl.replace("{type}", "380X380");
                        }
                        $.setShareContent('宝宝 hold 不住啦！限时秒！', window.location.href, '精选尖货限时秒！仅需 '+minPrice+' 元！即可抢 “'+minProduct.ProductName+'”', ProductPicUrl);

                    }


                }
                bindAction();
            });
        }

        $.tpl.helper("mathRound",function(data){
           return Math.round(data);
        });

        $.tpl.helper("formMateNewTime",function(data){
           return Math.round(data);
        });

        $.tpl.helper("returnState",function(state,name){
            var str = "";
            if(state == 1){
                str = "抢购中";
            }else if(state == 0){
                str = "即将开始";
            }
            return str;
        });

        $.tpl.helper("returnImgUrl",function(url){
            if (url.indexOf("{0}") > -1 && url.indexOf("{type}") <= -1) {
                return url.replace("{0}", "big");
            } else{
                return url.replace("{type}", "380X380");
            }
        });

        $.tpl.helper("returnPrice",function(Price){
            var pri = "";
            pri = Price.toFixed(2);
            return pri;
        });
        function bindAction(){
            //大于4天不显示倒计时
            $.each($(".countTime"), function(i, item){
                var seconds = parseInt($(item).attr("data-time"));
                if(seconds > 345600){
                    $(item).hide();
                }
            });

            $('.add_cart').not(".disabled_add").unbind().bind('click', function () {
                if(window.UserId <= 0){
                    $(this).attr('href',$.goToLogin());
                    return;
                }
                var _this = $(this);
                var urlparam = {
                    //一键购参数
                    productid: _this.attr("data-skuid"),         //商品id
                    producttype: _this.attr("data-protype"),       //商品类型
                    productnum: _this.attr("data-qty"),           //购买数量
                    promoid: _this.attr("data-proid"),         //促销id
                    from: "onekey",  //来源(onekey  一键购)
                    };
                _this.attr("href", window.webRoot  + "/shopping/oneKeyorder?" + $.param(urlparam, true));
            });
            $(".countTime").countTimeNew(function(){
                initPage();
            });

            $(".go_home").unbind().bind("click", function(){
                if(window.isMyzjApp == "True"){
                    $(this).attr("href", "myzj://index?pageid=1");
                }else{
                    $(this).attr("href", window.webRoot);
                }
            });

            if($(".topnav ul li.active").length == 0){
                $(".topnav ul li").eq(0).addClass("active");
            }

            $(".topnav ul li").unbind().bind("click", function(){
                var _this = $(this);
                if(_this.hasClass("active")){
                    return;
                }
                $(".secskillTimeContent .secskillTime-box").html("");
                var skillId = _this.data("id");
                var index = _this.index();
                $("#secskillTime-box").remove();
                _this.addClass("active").siblings().removeClass("active");
                $(".time-count .countTime-content").hide();
                $(".time-count .countTime-content").eq(index).show();
                var dataInfo = {
                    post:{
                        MjsName : skillId,
                        channel_id : window.SourceTypeSysNo,
                        user_guid : window.UserGuid,
                        user_id :window.UserId ,
                    }
                };
                $.loading(true);
                secskillModel.getSecskillListByTime(dataInfo, function(data){
                    $.loading(false);
                    $("#resetContent,.no_product").remove();
                    $.tplRender("tpl_secskillTime", data);

                if(data.Mjs != null)
                    {
                        var numbers = [];

                        for(var i=0;i<data.Mjs.MjsProducts.length;i++)
                        {
                            numbers.push(data.Mjs.MjsProducts[i].ProductPromPrice);//给数组赋值
                        }

                    var minPrice = Math.min.apply(Math,numbers);//找出数组里ProductPromPrice最小值
                    var minProduct = data.Mjs.MjsProducts[numbers.indexOf(minPrice)];//根据最小值在数组里第几个位置，相应找出MjsProducts里第几个商品是最低价//minProduct就是最低价的商品对象
                    if(minProduct != null && minProduct.ProductPicUrl != null ){
                        var ProductPicUrl= minProduct.ProductPicUrl;//图片地址
                    if (ProductPicUrl.indexOf("{0}") > -1 && ProductPicUrl.indexOf("{type}") <= -1) {
                        ProductPicUrl = ProductPicUrl.replace("{0}", "big");
                    } else{
                        ProductPicUrl = ProductPicUrl.replace("{type}", "380X380");
                    }
                    }


                    if($.isApp()){
                        $.setShareContent('宝宝 hold 不住啦！限时秒！', window.location.href, '精选尖货限时秒！仅需 '+minPrice+' 元！即可抢 “'+minProduct.ProductName+'”', ProductPicUrl);
                    }
                }

                    $('.add_cart').not(".disabled_add").on('click', function () {
                        if(window.UserId <= 0){
                            $(this).attr('href',$.goToLogin());
                            return;
                        }
                        var _this = $(this);
                        var urlparam = {
                            //一键购参数
                            productid: _this.attr("data-skuid"),         //商品id
                            producttype: _this.attr("data-protype"),       //商品类型
                            productnum: _this.attr("data-qty"),           //购买数量
                            promoid: _this.attr("data-proid"),         //促销id
                            from: "onekey",  //来源(onekey  一键购)
                            };
                        _this.attr("href", window.webRoot  + "/shopping/oneKeyorder?" + $.param(urlparam, true));
                    });

                    $(".go_home").unbind().bind("click", function(){
                        if(window.isMyzjApp == "True"){
                            $(this).attr("href", "myzj://index?pageid=1");
                        }else{
                            $(this).attr("href", window.webRoot);
                        }
                    });

                });
            });
        }
    }
);
