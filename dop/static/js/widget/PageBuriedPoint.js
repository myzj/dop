define('widget/PageBuriedPoint', ['lib/common'], function ($) {
    function bindClick() {
        $(".stats").click(function () {
            var position = $(this).data("position");
            var type = $(this).data("category");
            var id = $(this).attr("href");
            _gaq_push(position, type, id, 1);
            if (typeof ($.cookie.get("origdlid")) != 'undefined') {
                //客户真实标签
                _gaq.push(['_setCustomVar', 3, 'dlid', $.cookie.get("origdlid"), 2]);
                //随机分配（浏览组） A | B
                _gaq.push(['_setCustomVar', 4, 'visitgroup', $.cookie.get("VisitGroup"), 2]);
            }
        });
    }
    return {
        bindClick: bindClick
    }
});