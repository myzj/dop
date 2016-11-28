define('lib/log', function() {

    function debug() {
        if (window._debug_ && typeof console =='object' && console.debug) {
            for (var i = 0; i < arguments.length; i++) {
                console.debug(arguments[i]);
            }
        }
    }

    function log() {
        if (window._debug_ && typeof console =='object' && console.log) {
            for (var i = 0; i < arguments.length; i++) {
                console.log(arguments[i]);
            }
        }
    }

    return (function(){
        if (location.hash == '#debug') {
            try {
                localStorage.setItem('_debug_', '1');
            } catch (e) {
                //
            }
            window._debug_ = true;

        } else if (location.hash == '#nodebug') {
            try {
                localStorage.removeItem('_debug_');
            } catch (e) {
                //
            }
            window._debug_ = false;
        }
        try {
            if (localStorage.getItem('_debug_') == '1') {
                window._debug_ = true;
            }
        } catch (e) {

        }
        return {
            debug: debug,
            log:log,
            info:log
        }
    })();
});