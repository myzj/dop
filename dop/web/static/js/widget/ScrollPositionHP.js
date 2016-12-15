define('widget/ScrollPositionHP', ['lib/common'], function ($) {
    function Position(PositionObj, ScrollDistance) {
        $(window).on('scroll', function () {
            if ($(this).scrollTop() > ScrollDistance) {
                $(PositionObj).css({ "position": "fixed", "top": "0" }).removeClass("paixuMskHide").addClass("paixuMskShow");
            } else {
                $(PositionObj).css({ "position": "" }).removeClass("paixuMskHide").removeClass("paixuMskShow");
            }
        });
    }
    return {
        Position: Position
    }
})