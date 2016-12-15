define('model/login/loginModel', ['lib/common', 'api/login/loginApi'],
    function ($, loginApi) {
        function login(dataInfo, callback) {
            var dataInfo = dataInfo || {};
            $.xsr($.makeUrl(loginApi.login, dataInfo.post), function (res) {
                try {
                    callback && callback(res);
                } catch (e) {
                    //TODO handle the exception
                    throw e;
                }
            });
        };
        return {
            login: login,   //
         }
    }
);
