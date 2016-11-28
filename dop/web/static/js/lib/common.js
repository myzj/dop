define('lib/common', ['lib/makeUrl'], //
    function (makeUrl) {
        $.makeUrl = makeUrl;
        $.log = function (o, title) {
            if (window._debug_) {
                log.log.apply(this, arguments);
            }
        }
        return $;
});

