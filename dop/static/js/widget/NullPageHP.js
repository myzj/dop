define('widget/NullPageHP', ['lib/common', "config/url"], function ($, url) {
    function nullPage(imgUrl,desc,id) {
        var html = "<div class=\"null_box\">" +
                    "	<div class=\"null_img_box " + imgUrl + "\">" +
                    "	</div>" +
                    "	<div class=\"null_text_box\">" + desc +
                    "	</div>" +
                    "</div>";
        $(id).html(html);
    }
    return {
        nullPage: nullPage
    }
})