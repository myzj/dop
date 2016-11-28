define('api/login/loginApi', ['config/url'], function (configUrl) {
    return {
        login:{
            url: configUrl.login,
            method:"get",
            post: {
                "Token":window.Token,
                "isApp":window.isMyzjApp
            }
        }
    }
});