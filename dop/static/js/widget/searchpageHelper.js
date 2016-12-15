define('widget/searchpageHelper', ['lib/common', 'model/CommodityDisplay/CommodityDisplayModel', "config/url"], function ($, sh, url) {
    function searchPage() {
        var html = '<div class="search_page"><div class="touchweb_header"><a class="hd_left hd_back search_width" id="search_back"><i class="iconfont">&#xe606;</i></a><div class="hd_title hd_search"><span><i class="icon iconfont">&#xe616;</i></span> <input type="text" placeholder="搜索" id="search_text"></div><div class="hd_right" id="search_product"><a class="hd_btn">搜索</a></div></div><div class="search_list"><ul></ul></div></div>';
        $("body").append(html);
        var setTime = "";
        $("#search_text").on("input propertychange", function () {
            var thisvalue = $(this).val();
            clearTimeout(setTime);
            setTime = setTimeout(function () {
                var searchtext = {
                    post: {
                        word: thisvalue,
                        hit: 10
                    }
                }
                sh.GetGoodsSearchStatistics(searchtext, function (data) {
                    $(".search_list ul").html("");
                    if (!$.isNull(data.data.suggestions)) {
                        if (data.data.suggestions.length > 0) {
                            for (var i = 0; i < data.data.suggestions.length; i++) {
                                var slist = '<li><div class="list_item"><label>{0}</label><label>约{1}条商品</label></div></li>';
                                slist = slist.format(data.data.suggestions[i].keyword, data.data.suggestions[i].count);
                                $(".search_list ul").append(slist);
                            }
                            $(".list_item").on("click", function() {
                                var _url_par = {
                                    k: $(this).find("label:first-child").html()
                                }
                                $.url.redirect($.url.getDomainUrl() + "Search?" + $.param(_url_par, true));
                            });
                        }
                    }
                });
            }, 500);

        });
        $("#ckSearch").focus(function () {
            $(".search_page").show().removeClass("sidebarhide").addClass("sidebarshow");
            $("body").addClass("disablescroll");
            $("#search_text").focus();
        });
        $("#search_back").click(function () {
            $(".search_page").removeClass("sidebarshow").addClass("sidebarhide");
            $("body").removeClass("disablescroll");
            $("#search_text").blur();
        });
        $("#search_product").on("click", function () {
            var _url_par = {
                k: $("#search_text").val()
            }
            $.url.redirect($.url.getDomainUrl() + "Search?" + $.param(_url_par, true));
        });
    }
    document.onkeydown = function (e) {
        var ev = document.all ? window.event : e;
        if (ev.keyCode == 13) {
            var _url_par = {
                k: $("#search_text").val()
            }
            $.url.redirect($.url.getDomainUrl() + "Search?" + $.param(_url_par, true));
        }
    }
    return {
        searchPage: searchPage
    }
});